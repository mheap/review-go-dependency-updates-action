# Review Go Dependency Updates

Have the PR body updated with the library's release notes when updating `go.mod` in a pull request.

Useful to see what's changed based on your go.mod changes.

## Sample

### go.mod change

```diff
require (
	-github.com/kong/go-apiops v0.1.31
	-github.com/kong/go-database-reconciler v1.8.0
	+github.com/kong/go-apiops v0.1.32
	+github.com/kong/go-database-reconciler v1.10.0
)
```

### Output

<details markdown="1"><summary>github.com/kong/go-apiops (v0.1.31 => v0.1.32)</summary>
<h2>v0.1.32</h2>

### Changelog

- 497a692 fix(o2k): change regex prio to int from uint (#162)
- 0c28239 chore(deps): bump github.com/onsi/ginkgo/v2 from 2.17.0 to 2.17.1 (#161)
- 5f78deb chore(deps): bump github.com/onsi/gomega from 1.31.1 to 1.32.0 (#160)
- a267f57 chore(deps): bump github.com/onsi/ginkgo/v2 from 2.16.0 to 2.17.0 (#159)
- 05ef8ef chore(deps): bump github.com/onsi/ginkgo/v2 from 2.15.0 to 2.16.0 (#156)

</details>
<details markdown="1"><summary>github.com/kong/go-database-reconciler (v1.8.0 => v1.10.0)</summary>
<h2>v1.10.0</h2>

### What's Changed

- Add a new system for sending change events through a channel for clients to log as they see fit, instead of logging changes directly from the library: https://github.com/Kong/go-database-reconciler/pull/76

**Full Changelog**: https://github.com/Kong/go-database-reconciler/compare/v1.9.0...v1.10.0

<h2>v1.9.0</h2>

### What's Changed

- Support licenses in dump and sync https://github.com/Kong/go-database-reconciler/pull/61

**Full Changelog**: https://github.com/Kong/go-database-reconciler/compare/v1.8.0...v1.9.0</details><!-- trigger/dependency_upgrade -->
