#!/bin/bash

# Répertoire à archiver (le dossier courant)
SOURCE_DIR="."

# Nom de l'archive de sortie (avec date)
OUTPUT_FILE="../DansMaZone-$(date +%F).tar.gz"

# Répertoires à exclure (niveau racine)
EXCLUDED_DIRS=(
  "dist"
  "node_modules"
  "promotion"
  "html-cache"
)

# Fichiers spécifiques à exclure (niveau racine)
EXCLUDED_FILES=(
  "build.sh"
  "CLAUDE.md"
  "DansMaZone.code-workspace"
  "init.sh"
  "LICENSE.md"
  "list.sh"
  "nodemon.edit-sites.json"
  "package-lock.json"
  "README.md"
  "TODO.md"
)

# Construction des options --exclude
EXCLUDE_ARGS=()

# Exclure les répertoires
for dir in "${EXCLUDED_DIRS[@]}"; do
  EXCLUDE_ARGS+=(--exclude="$SOURCE_DIR/$dir")
done

# Exclure les fichiers
for file in "${EXCLUDED_FILES[@]}"; do
  EXCLUDE_ARGS+=(--exclude="$SOURCE_DIR/$file")
done

# Exclure tous les fichiers et dossiers cachés au premier niveau (sans exclure "." ou "..")
for hidden in $(find . -maxdepth 1 \( -name '.*' ! -name '.' ! -name '..' \)); do
  EXCLUDE_ARGS+=(--exclude="$hidden")
done

# Création de l'archive
tar -czf "$OUTPUT_FILE" "${EXCLUDE_ARGS[@]}" "$SOURCE_DIR"

echo "✅ Archive créée : $OUTPUT_FILE"