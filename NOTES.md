# Project Notes

This repository is a small todo application used as a lazybones workflow target. It pairs an Express backend (exposing a REST API to list, create, and delete todos) with a minimal static frontend that consumes it, plus backend unit tests and Playwright-based end-to-end tests.

## Usage

> Note: although the project is described above as a Node/Express todo app, this
> worktree currently contains only a minimal Rust crate (`testing`, a library —
> see `Cargo.toml` and `src/lib.rs`). The Node `backend/`, `frontend/`, and
> `e2e/` sources referenced in `README.md` are not present here. The commands
> below document what actually builds and runs in this checkout.

This is a Cargo workspace member, so build and test with the standard Rust
toolchain (`cargo`, installed via [rustup](https://rustup.rs)).

**Build:**

```bash
cargo build              # build this crate
cargo build --workspace  # build all workspace members
```

**Run the tests:**

```bash
cargo test               # run this crate's tests (currently 0 tests)
cargo test --workspace   # run tests across the workspace
```

There is no runnable binary — `testing` is a library crate (`[lib]` in
`Cargo.toml`), so there is no `cargo run` target. The crate exists primarily so
that `cargo test --workspace` succeeds.
