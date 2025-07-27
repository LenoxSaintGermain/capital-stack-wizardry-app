---
allowed-tools: Bash(cp:*, echo:*, date:*)
description: Save the current conversation to a Markdown file with a timestamp.
argument-hint: [optional-filename]
---

## Context

- Saving current conversation to a Markdown file.
- Timestamp: !`date +"%Y-%m-%d_%H-%M-%S"`

## Your task

Save the current conversation to a file named:
- If an argument is provided: `$ARGUMENTS.md`
- Otherwise: `chat-$(date +"%Y-%m-%d_%H-%M-%S").md`

Append the conversation content below to the file.

---

$CONVERSATION

---

# Save Chat Command Documentation

This command allows you to save the current chat conversation for future reference and project documentation.

## Usage

```
/save-chat [filename]
```

## Description

This command will save the current chat conversation to a markdown file in the project directory. The saved chat will include:

- All messages from the current conversation
- Code snippets and file changes discussed
- Timestamp and context information
- Links to any files that were created or modified

## Examples

```bash
# Save with default filename (timestamp-based)
/save-chat

# Save with custom filename
/save-chat project-million-integration-session

# Save with descriptive name
/save-chat portfolio-dashboard-development
```

## Output Location

Saved chats will be stored in the current project directory with the following naming convention:
- Default: `chat-YYYY-MM-DD_HH-MM-SS.md`
- Custom: `[custom-filename].md`

## Features

- Automatic timestamp generation using system date
- Code syntax highlighting preservation
- File change tracking
- Session context preservation
- Easy searchability for future reference
- Uses bash tools for reliable file operations

## Technical Implementation

- Uses `date` command for timestamp generation
- Uses `echo` for writing conversation content
- Uses `cp` for any file copying operations if needed
- Automatically handles filename formatting

## Notes

- This command helps maintain project documentation
- Useful for tracking development decisions and rationale
- Enables team collaboration and knowledge sharing
- Serves as a development journal for the Project Million codebase
- Files are saved directly in the project root for easy access
