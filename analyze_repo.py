import os

exclude_dirs = {'node_modules', '.next', 'dist', '.git', '.turbo', 'venv', '__pycache__', '.vercel', 'env_backups'}

def build_tree(dir_path, prefix=""):
    try:
        entries = sorted(os.listdir(dir_path))
    except Exception:
        return ""
        
    tree_str = ""
    for i, entry in enumerate(entries):
        if entry in exclude_dirs:
            continue
        path = os.path.join(dir_path, entry)
        is_last = (i == len(entries) - 1)
        connector = "└── " if is_last else "├── "
        
        if os.path.isdir(path):
            tree_str += f"{prefix}{connector}{entry}/\n"
            new_prefix = prefix + ("    " if is_last else "│   ")
            tree_str += build_tree(path, new_prefix)
        else:
            if not entry.endswith('.json') and not entry.endswith('.lock') and not entry.endswith('.log') and not entry.endswith('.txt'):
                tree_str += f"{prefix}{connector}{entry}\n"
    return tree_str

if __name__ == "__main__":
    with open("repo_structure.txt", "w", encoding="utf-8") as f:
        f.write(build_tree("."))
