# Project Notes

This repository is a lazybones workflow target. It documents a small todo
application that pairs an Express REST backend (list, create, and delete todos)
with a minimal static frontend that consumes it, plus backend unit tests and
Playwright end-to-end tests.

The current worktree also carries a minimal Rust crate (`testing`) so that
`cargo test --workspace` succeeds.

## Usage

The only buildable artifact present in this worktree is the minimal Rust crate
`testing` (a placeholder library defined by `Cargo.toml` and `src/lib.rs`). Build
and test it with Cargo:

```bash
# Build the crate
cargo build

# Run the test suite across the workspace
cargo test --workspace
```

The crate is a library placeholder with no `main`, so there is no binary to run;
`cargo build` simply compiles the library.

> The Node todo application described above (Express backend, static frontend,
> Playwright e2e tests) is documented in `README.md`. Those `backend/`,
> `frontend/`, and `e2e/` directories are not present in this worktree, so the
> `npm`/`node` commands there cannot be run here.
