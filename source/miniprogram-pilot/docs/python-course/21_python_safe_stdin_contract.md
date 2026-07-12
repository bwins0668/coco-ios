# Python Safe Stdin Contract

## Scope

Train1 may include a real input lesson because sourceOrder 13 is the chapter
for user input and while loops. Input is allowed only in the new Python shard
and only when the lesson provides deterministic sample input.

## Lesson Contract

For every code example that uses `input()`:

- `sampleInput` is a visible lesson field on the code example.
- The new shard lesson renderer displays `入力例 / 输入示例`.
- The checker feeds `sampleInput` to CPython as the only stdin fixture.
- Actual stdout must equal `expectedOutput` exactly after newline normalization.
- Execution uses a timeout so examples cannot wait for extra input forever.

For code examples without `input()`:

- `sampleInput` must not be present.
- Ordinary examples continue to be checked as non-interactive examples by the
  Train1 checker.

## Forbidden Bypass

The contract does not use a mock or monkeypatch. The checker runs the submitted
code with CPython and stdin text. The renderer must consume `sampleInput`; a
hidden metadata-only field is a failure.
