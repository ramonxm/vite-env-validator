#!/bin/bash

# Script para fazer release do pacote
# Uso: ./scripts/release.sh [patch|minor|major]

set -e

# Verificar se o argumento foi fornecido
if [ -z "$1" ]; then
    echo "Uso: $0 [patch|minor|major]"
    echo "Exemplo: $0 patch"
    exit 1
fi

VERSION_TYPE=$1

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Há mudanças não commitadas. Faça commit antes de fazer release."
    exit 1
fi

# Verificar se está na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Você deve estar na branch main para fazer release."
    echo "Branch atual: $CURRENT_BRANCH"
    exit 1
fi

echo "🚀 Iniciando release $VERSION_TYPE..."

# Fazer bump da versão
pnpm version $VERSION_TYPE --no-git-tag-version

# Pegar a nova versão
NEW_VERSION=$(node -p "require('./package.json').version")

echo "📦 Versão $NEW_VERSION criada"

# Fazer commit das mudanças
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Criar tag
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo "✅ Release v$NEW_VERSION criado!"
echo "📤 Para publicar, execute: git push && git push --tags" 