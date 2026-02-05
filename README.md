# tldraw Editor - Programmatic Canvas Tool

A Next.js app with tldraw that allows programmatic manipulation of canvas files.

## Features

- 📐 **Full tldraw canvas** - Draw, write, add shapes
- 📥 **Export JSON** - Save canvas state as JSON
- 📤 **Import JSON** - Load and restore canvas from JSON
- 📊 **Analyze** - Get shape statistics
- ➡️ **Transform** - Batch modify shapes (example: move all shapes)
- 🗑️ **Clear** - Delete all shapes

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## How It Works

1. **Edit in Canvas** - Use the tldraw toolbar to draw/design
2. **Export** - Click "Export JSON" to download the canvas state
3. **Programmatic Manipulation** - Edit the JSON or extend with custom transforms
4. **Import** - Click "Import JSON" to load back into canvas

## API Examples (in code)

### Get all shapes
```typescript
const shapes = editor.getCurrentPageShapes()
```

### Move all shapes right 100px
```typescript
editor.updateShapes(
  shapes.map(s => ({
    id: s.id,
    type: s.type,
    x: s.x + 100,
  }))
)
```

### Delete all shapes of a type
```typescript
const textShapes = shapes.filter(s => s.type === 'text')
editor.deleteShapes(textShapes.map(s => s.id))
```

### Change text color
```typescript
editor.updateShapes(
  textShapes.map(s => ({
    id: s.id,
    type: 'text',
    props: {
      ...s.props,
      color: 'red',
    }
  }))
)
```

## Next: Loading tldraw.com Files

To load files from tldraw.com URLs like `https://www.tldraw.com/f/tsyBK_sB4TKroMdNdjCfU`:
1. Export from tldraw.com as JSON
2. Import into this editor
3. Manipulate programmatically
4. Export back and re-upload

## Extend

Add new buttons to `app/page.tsx` for custom transforms:
- Resize all shapes
- Change colors
- Reorganize layout
- Add connectors
- etc.

**Built with:** Next.js, React, tldraw SDK
