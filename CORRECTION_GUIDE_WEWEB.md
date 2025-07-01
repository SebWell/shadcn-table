# 🔧 Guide de correction pour les composants Weweb

## 📋 Vue d'ensemble

Ce document détaille toutes les actions nécessaires pour corriger 47 projets de composants Weweb qui ne fonctionnent pas correctement en raison d'une mauvaise gestion des propriétés.

### 🎯 Problème identifié
- Les composants accèdent directement aux props (`props.data`, `props.columns`, etc.)
- Weweb utilise une structure encapsulée `props.content.xxx`
- Le fichier `ww-config.js` ne définit pas correctement les propriétés

---

## 🛠️ Actions à mener

### 1. **Correction du fichier `src/wwElement.vue`**

#### 1.1 Remplacement des computed properties

**❌ Code actuel à remplacer :**
```javascript
const data = computed(() => props.data || [])
const columns = computed(() => props.columns || [])
const showHeader = computed(() => props.showHeader !== false)
const totalColumns = computed(() => columns.value.length + (props.selectable ? 1 : 0))
```

**✅ Code corrigé :**
```javascript
const data = computed(() => props.content.data || [])
const columns = computed(() => props.content.columns || [])
const showHeader = computed(() => props.content.showHeader !== false)
const totalColumns = computed(() => columns.value.length + (props.content.selectable ? 1 : 0))
```

#### 1.2 Correction des références dans le template

| **Rechercher** | **Remplacer par** |
|----------------|-------------------|
| `:class="cn('relative w-full overflow-auto', containerClass)"` | `:class="cn('relative w-full overflow-auto', content.containerClass)"` |
| `:class="cn('w-full caption-bottom text-sm', customClass)"` | `:class="cn('w-full caption-bottom text-sm', content.customClass)"` |
| `v-if="caption"` | `v-if="content.caption"` |
| `{{ caption }}` | `{{ content.caption }}` |
| `:class="cn('mt-4 text-sm text-muted-foreground', captionClass)"` | `:class="cn('mt-4 text-sm text-muted-foreground', content.captionClass)"` |
| `:class="cn('[&_tr]:border-b', headerClass)"` | `:class="cn('[&_tr]:border-b', content.headerClass)"` |
| `:class="cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', headerRowClass)"` | `:class="cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', content.headerRowClass)"` |
| `v-if="selectable"` | `v-if="content.selectable"` |
| `:class="cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', checkboxCellClass)"` | `:class="cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', content.checkboxCellClass)"` |
| `headerCellClass,` | `content.headerCellClass,` |
| `:class="cn('[&_tr:last-child]:border-0', bodyClass)"` | `:class="cn('[&_tr:last-child]:border-0', content.bodyClass)"` |
| `rowClass` | `content.rowClass` |
| `checkboxCellClass)"` | `content.checkboxCellClass)"` |
| `cellClass,` | `content.cellClass,` |
| `:class="cn('p-8 text-center text-muted-foreground', emptyCellClass)"` | `:class="cn('p-8 text-center text-muted-foreground', content.emptyCellClass)"` |
| `{{ emptyText \|\| 'No data available' }}` | `{{ content.emptyText \|\| 'No data available' }}` |
| `v-if="showFooter"` | `v-if="content.showFooter"` |
| `:class="cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', footerClass)"` | `:class="cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', content.footerClass)"` |
| `footerCellClass,` | `content.footerCellClass,` |

#### 1.3 Correction des méthodes JavaScript

**❌ Dans la fonction `getRowKey` :**
```javascript
if (props.rowKey && row[props.rowKey]) {
    return row[props.rowKey]
}
```

**✅ Corriger par :**
```javascript
if (props.content.rowKey && row[props.content.rowKey]) {
    return row[props.content.rowKey]
}
```

---

### 2. **Remplacement complet du fichier `ww-config.js`**

**📄 Nouveau contenu du fichier `ww-config.js` :**

```javascript
export default {
    editor: {
        label: 'Shadcn Table',
        icon: 'table',
    },
    triggerEvents: [
        { name: 'rowClick', label: 'On Row Click', event: { row: {}, index: 0 } },
        { name: 'sort', label: 'On Sort', event: { key: '', direction: 'asc' } },
        { name: 'selectionChange', label: 'On Selection Change', event: { selectedRows: [], selectedKeys: [] } }
    ],
    properties: {
        data: {
            label: 'Data',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        columns: {
            label: 'Columns',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        selectable: {
            label: 'Selectable rows',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        showHeader: {
            label: 'Show header',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: true
        },
        showFooter: {
            label: 'Show footer',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        caption: {
            label: 'Caption',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: ''
        },
        emptyText: {
            label: 'Empty state text',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'No data available'
        },
        rowKey: {
            label: 'Row key field',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'id'
        },
        containerClass: {
            label: 'Container CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        customClass: {
            label: 'Table CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        headerClass: {
            label: 'Header CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        bodyClass: {
            label: 'Body CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        footerClass: {
            label: 'Footer CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        rowClass: {
            label: 'Row CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        cellClass: {
            label: 'Cell CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        }
    }
};
```

---

## 🤖 Script d'automatisation

### 📄 Script Bash pour corriger tous les projets

**Fichier : `fix-weweb-components.sh`**

```bash
#!/bin/bash

# Script pour corriger automatiquement tous les projets Weweb
# Usage: ./fix-weweb-components.sh
# Auteur: Assistant IA
# Date: $(date)

echo "🚀 Début de la correction automatique des composants Weweb"
echo "📊 Nombre de projets à corriger: 47"
echo ""

# Compteur pour le suivi
project_count=0
success_count=0
error_count=0

fix_project() {
    local project_dir="$1"
    local project_name=$(basename "$project_dir")
    
    echo "🔧 [$((++project_count))/47] Correction du projet: $project_name"
    
    # Vérification de l'existence des fichiers requis
    if [ ! -f "$project_dir/src/wwElement.vue" ]; then
        echo "❌ Fichier wwElement.vue introuvable dans $project_dir"
        ((error_count++))
        return 1
    fi
    
    if [ ! -f "$project_dir/ww-config.js" ]; then
        echo "❌ Fichier ww-config.js introuvable dans $project_dir"
        ((error_count++))
        return 1
    fi
    
    # Création des sauvegardes avec timestamp
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    cp "$project_dir/src/wwElement.vue" "$project_dir/src/wwElement.vue.backup_$timestamp"
    cp "$project_dir/ww-config.js" "$project_dir/ww-config.js.backup_$timestamp"
    
    # Corrections dans wwElement.vue - Props directs
    sed -i 's/props\.data/props.content.data/g' "$project_dir/src/wwElement.vue"
    sed -i 's/props\.columns/props.content.columns/g' "$project_dir/src/wwElement.vue"
    sed -i 's/props\.showHeader/props.content.showHeader/g' "$project_dir/src/wwElement.vue"
    sed -i 's/props\.selectable/props.content.selectable/g' "$project_dir/src/wwElement.vue"
    sed -i 's/props\.rowKey/props.content.rowKey/g' "$project_dir/src/wwElement.vue"
    
    # Corrections template - Classes CSS
    sed -i 's/, containerClass)/, content.containerClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, customClass)/, content.customClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/v-if="caption"/v-if="content.caption"/g' "$project_dir/src/wwElement.vue"
    sed -i 's/{{ caption }}/{{ content.caption }}/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, captionClass)/, content.captionClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, headerClass)/, content.headerClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, headerRowClass)/, content.headerRowClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, checkboxCellClass)/, content.checkboxCellClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, headerCellClass,/, content.headerCellClass,/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, bodyClass)/, content.bodyClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, rowClass/, content.rowClass/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, cellClass,/, content.cellClass,/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, emptyCellClass)/, content.emptyCellClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/emptyText \|\|/content.emptyText ||/g' "$project_dir/src/wwElement.vue"
    sed -i 's/v-if="showFooter"/v-if="content.showFooter"/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, footerClass)/, content.footerClass)/g' "$project_dir/src/wwElement.vue"
    sed -i 's/, footerCellClass,/, content.footerCellClass,/g' "$project_dir/src/wwElement.vue"
    sed -i 's/v-if="selectable"/v-if="content.selectable"/g' "$project_dir/src/wwElement.vue"
    
    # Remplacement complet du ww-config.js
    cat > "$project_dir/ww-config.js" << 'EOF'
export default {
    editor: {
        label: 'Shadcn Table',
        icon: 'table',
    },
    triggerEvents: [
        { name: 'rowClick', label: 'On Row Click', event: { row: {}, index: 0 } },
        { name: 'sort', label: 'On Sort', event: { key: '', direction: 'asc' } },
        { name: 'selectionChange', label: 'On Selection Change', event: { selectedRows: [], selectedKeys: [] } }
    ],
    properties: {
        data: {
            label: 'Data',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        columns: {
            label: 'Columns',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        selectable: {
            label: 'Selectable rows',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        showHeader: {
            label: 'Show header',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: true
        },
        showFooter: {
            label: 'Show footer',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        caption: {
            label: 'Caption',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: ''
        },
        emptyText: {
            label: 'Empty state text',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'No data available'
        },
        rowKey: {
            label: 'Row key field',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'id'
        },
        containerClass: {
            label: 'Container CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        customClass: {
            label: 'Table CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        headerClass: {
            label: 'Header CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        bodyClass: {
            label: 'Body CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        footerClass: {
            label: 'Footer CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        rowClass: {
            label: 'Row CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        cellClass: {
            label: 'Cell CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        }
    }
};
EOF
    
    # Validation post-correction
    if grep -q "props\.content\." "$project_dir/src/wwElement.vue" && \
       grep -q "properties:" "$project_dir/ww-config.js"; then
        echo "✅ Projet $project_name corrigé avec succès"
        ((success_count++))
        return 0
    else
        echo "❌ Erreur lors de la correction de $project_name"
        ((error_count++))
        return 1
    fi
}

# Application sur tous les projets
echo "🔍 Recherche des projets à corriger..."

# Méthode 1: Si les projets sont dans des dossiers spécifiques
for project in */; do
    if [ -d "$project" ] && [ -f "$project/ww-config.js" ]; then
        fix_project "$project"
    fi
done

# Méthode 2: Si vous avez une liste de projets spécifique
# Décommentez et adaptez selon vos besoins :
# projects=(
#     "shadcn-table-1"
#     "shadcn-table-2"
#     # ... ajoutez vos 47 projets
# )
# 
# for project in "${projects[@]}"; do
#     if [ -d "$project" ]; then
#         fix_project "$project"
#     fi
# done

echo ""
echo "📊 RAPPORT FINAL"
echo "═══════════════════════════════════════"
echo "🎯 Projets traités: $project_count"
echo "✅ Corrections réussies: $success_count"
echo "❌ Erreurs: $error_count"
echo ""

if [ $success_count -eq 47 ]; then
    echo "🎉 FÉLICITATIONS ! Tous les projets ont été corrigés avec succès !"
elif [ $success_count -gt 0 ]; then
    echo "⚠️  Correction partielle: $success_count/$project_count projets corrigés"
    echo "📝 Vérifiez manuellement les projets en erreur"
else
    echo "💥 Aucun projet n'a pu être corrigé automatiquement"
    echo "🔍 Vérifiez la structure de vos dossiers et l'existence des fichiers"
fi

echo ""
echo "📂 Les sauvegardes ont été créées avec l'extension .backup_TIMESTAMP"
echo "🔧 Correction terminée à $(date)"
```

**🚀 Utilisation du script :**

```bash
# Rendre le script exécutable
chmod +x fix-weweb-components.sh

# Exécuter la correction
./fix-weweb-components.sh
```

---

## ✅ Validation post-correction

### 🔍 Checklist pour chaque projet

- [ ] **Aucune référence directe** à `props.data`, `props.columns`, etc.
- [ ] **Toutes les propriétés** passent par `props.content.xxx`
- [ ] **Le ww-config.js** définit toutes les propriétés utilisées
- [ ] **Les événements** sont correctement définis dans `triggerEvents`
- [ ] **Les fichiers de sauvegarde** (.backup) sont créés
- [ ] **Le composant se charge** sans erreur dans Weweb

### 🧪 Commandes de test

```bash
# Test 1: Vérifier qu'aucune référence directe ne subsiste
grep -r "props\.[^c]" */src/wwElement.vue && echo "❌ Props directs détectés" || echo "✅ Pas de props directs"

# Test 2: Vérifier la présence des propriétés dans ww-config.js
grep -r "properties:" */ww-config.js && echo "✅ Propriétés définies" || echo "❌ Propriétés manquantes"

# Test 3: Compter les fichiers de sauvegarde créés
find . -name "*.backup_*" | wc -l
```

### 🎯 Points de contrôle spécifiques

1. **Structure des props** : Vérifier que toutes les références sont `props.content.xxx`
2. **Configuration Weweb** : S'assurer que `ww-config.js` contient toutes les propriétés
3. **Événements** : Confirmer que les `triggerEvents` sont définis
4. **Fonctionnalité** : Tester le composant dans l'éditeur Weweb

---

## 📚 Ressources et références

- **Documentation Weweb** : [weweb.io/docs](https://weweb.io/docs)
- **Assets Weweb** : [github.com/weweb-assets](https://github.com/weweb-assets)
- **Shadcn/UI** : [ui.shadcn.com](https://ui.shadcn.com)

---

## 🆘 Dépannage

### Problèmes courants et solutions

| **Problème** | **Cause** | **Solution** |
|--------------|-----------|--------------|
| Composant ne se charge pas | Props incorrects | Vérifier les `props.content.xxx` |
| Propriétés non visibles | ww-config.js incomplet | Utiliser le nouveau ww-config.js |
| Erreurs JavaScript | Références manquantes | Vérifier toutes les corrections |
| Événements non déclenchés | triggerEvents manquants | Ajouter les événements dans ww-config |

### 📞 Support

En cas de problème persistant :
1. Vérifier les fichiers de sauvegarde (.backup)
2. Comparer avec le fichier `wwElement.vue.backup` original
3. Restaurer manuellement si nécessaire

---

**📝 Document créé le :** $(date)  
**🎯 Objectif :** Corriger 47 projets de composants Weweb  
**⚡ Status :** Prêt pour exécution automatisée