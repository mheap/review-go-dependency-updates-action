const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");

const fs = require("fs");

async function action() {
  try {
    const token = core.getInput("token", { required: true });
    const octokit = github.getOctokit(token, {});

    // Load the diff for this PR and calculate the updated modules
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.issue.number,
    });

    const goMod = files.filter((file) => file.filename === "go.mod")[0];
    const updatedDirectDeps = goMod.patch.split("\n").filter((line) => {
      return (
        (line.startsWith("+") || line.startsWith("-")) &&
        !line.endsWith("// indirect")
      );
    });

    // Build a map of from -> to for the updated dependencies
    const updatedDeps = updatedDirectDeps.reduce((acc, line) => {
      const parts = line.split(" ");
      const [event, project] = parts[0].split("\t");
      const version = parts[1];
      if (!acc[project]) {
        acc[project] = {};
      }
      if (event === "+") {
        acc[project].to = version;
      }
      if (event === "-") {
        acc[project].from = version;
      }
      acc[project].releaseNotes = {};
      return acc;
    }, {});

    // Pull the release notes for each of those versions
    for (const project of Object.keys(updatedDeps)) {
      const [projectRepo, projectOwner] = project.split("/").reverse();
      const { data: releases } = await octokit.rest.repos.listReleases({
        owner: projectOwner,
        repo: projectRepo,
      });

      // Loop until we hit a release that matches the version we're looking for
      for (const release of releases) {
        if (!semver.valid(release.name)) {
          continue;
        }
        if (
          semver.gt(release.name, updatedDeps[project].from) &&
          semver.lte(release.name, updatedDeps[project].to)
        ) {
          updatedDeps[project].releaseNotes[release.name] = release.body;
        }
      }
    }

    // Build message
    let message = Object.keys(updatedDeps)
      .map((project) => {
        const notes = Object.keys(updatedDeps[project].releaseNotes)
          .map((version) => {
            return `<h2>${version}</h2> \n\n${updatedDeps[project].releaseNotes[
              version
            ].replace("##", "###")}`;
          })
          .join("\n\n");
        return `<details markdown="1"><summary>${project} (${updatedDeps[project].from} => ${updatedDeps[project].to})</summary>\n${notes}</details>`;
      })
      .join("\n");

    message = `${message}<!-- trigger/dependency_upgrade -->`;

    // Update PR body with message using the GitHub API
    await octokit.rest.issues.update({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      body: message,
    });

    core.setOutput("status", "success");
  } catch (e) {
    console.error(e);
    core.setFailed(e.message);
    core.setOutput("status", "failure");
  }
}

/* istanbul ignore next */
if (require.main === module) {
  action();
}

module.exports = action;
