# @markdown-viewer/drawio2svg

A lightweight, pure TypeScript library for converting DrawIO (.drawio) diagrams to SVG format.

## Features

- **Zero browser dependencies** - Works in browser and fibjs server-side environments
- **Full DrawIO support** - Parses both compressed (deflate+base64) and plain XML formats
- **Comprehensive shape rendering** - Supports 100+ built-in shapes and custom stencils
- **Edge routing** - Intelligent edge routing with multiple arrow styles
- **Text measurement** - Pluggable text measurement providers for accurate text layout
- **Stencil support** - Load and render custom mxGraph stencil libraries

## Installation

```bash
npm install @markdown-viewer/drawio2svg
```

## Quick Start

```typescript
import { convert } from '@markdown-viewer/drawio2svg';

// Convert DrawIO XML to SVG
const drawioXml = fs.readFileSync('diagram.drawio', 'utf-8');
const svg = convert(drawioXml);

fs.writeFileSync('diagram.svg', svg);
```

## API Reference

### `convert(drawioXml, options?)`

Convert a DrawIO XML string to SVG in one call.

```typescript
import { convert } from '@markdown-viewer/drawio2svg';

const svg = convert(drawioXml, {
  pageIndex: 0,           // Page index to render (default: 0)
  backgroundColor: null,  // Background color (default: transparent)
  padding: 2,             // Padding around the diagram (default: 2)
  scale: 1,               // Scale factor (default: 1)
  fontFamily: 'Arial',    // Default font family (optional)
  stencils: null          // StencilBundle for custom stencils
});
```

### `parse(drawioXml)` / `DrawioParser`

Parse DrawIO XML into a structured format for inspection or custom processing.

```typescript
import { parse, DrawioParser } from '@markdown-viewer/drawio2svg';

// Functional API
const parsed = parse(drawioXml);

// Class-based API
const parser = new DrawioParser();
const parsed = parser.parse(drawioXml);

// Access diagram structure
console.log(parsed.diagrams[0].name);    // Diagram name
console.log(parsed.diagrams[0].cells);   // Array of cells (shapes/edges)
```

### `SvgRenderer`

Low-level renderer for custom rendering pipelines.

```typescript
import { DrawioParser, SvgRenderer } from '@markdown-viewer/drawio2svg';

const parser = new DrawioParser();
const parsed = parser.parse(drawioXml);

const renderer = new SvgRenderer({
  pageIndex: 0,
  padding: 10,
  scale: 2,
  fontFamily: 'Arial',
  stencils: myStencilBundle
});

const svg = renderer.render(parsed);
```

### `decompress(xml)`

Decompress DrawIO files that contain compressed diagram content.

```typescript
import { decompress } from '@markdown-viewer/drawio2svg';

// Decompress all <diagram> tags with compressed content
const decompressedXml = decompress(compressedDrawioXml);
```

### Text Measurement

In fibjs environments, a WebView-based text measurement provider is **automatically configured** when you import `@markdown-viewer/drawio2svg`. No manual setup is needed.

You can also set a custom provider if desired:

```typescript
import { 
  setTextMeasureProvider, 
  getTextMeasureProvider,
  resetTextMeasureProvider 
} from '@markdown-viewer/drawio2svg';

// Set a custom provider
setTextMeasureProvider({
  measureText(text, fontSize, fontFamily, fontWeight, fontStyle, isHtml) {
    // Return { width, height } in pixels
    return { width: estimatedWidth, height: estimatedHeight };
  },
  measureTextLayout(text, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml) {
    // Return layout info with line details
    return { width, height, lineCount, lineHeight };
  }
});

// Get current provider
const provider = getTextMeasureProvider();

// Reset to default
resetTextMeasureProvider();
```

### Stencil Support

Load and use custom mxGraph stencil libraries.

```typescript
import { createStencilBundle, convert } from '@markdown-viewer/drawio2svg';

// Create a stencil bundle from a source
const stencilBundle = createStencilBundle({
  groups: () => ['aws4', 'gcp2', 'kubernetes'],
  load: (group) => {
    // Return compressed stencil data for the group
    return fs.readFileSync(`stencils/${group}.json`, 'utf-8');
  }
});

// Use stencils in conversion
const svg = convert(drawioXml, { stencils: stencilBundle });
```

## Supported Shapes

The library supports a comprehensive set of shapes including:

### Core Shapes
- Rectangle, Ellipse, Rhombus, Triangle
- Hexagon, Octagon, Pentagon
- Parallelogram, Trapezoid
- Cylinder, Cloud, Actor
- Swimlane, Table

### Diagram Types
- **Flowcharts** - Standard flowchart symbols
- **UML** - Class, sequence, activity, state diagrams
- **BPMN** - Business process modeling notation
- **ER** - Entity-relationship diagrams
- **Network** - Cisco, AWS, GCP, Azure icons
- **Architecture** - C4, ArchiMate, SysML
- **Mockups** - UI wireframe components
- **Infographics** - Charts, timelines, lists

### Stencil Libraries
Pre-built stencil support for:
- AWS (aws3, aws3d, aws4)
- Google Cloud Platform (gcp, gcp2)
- Microsoft Azure
- Kubernetes
- Cisco networking
- IBM, Alibaba Cloud
- Bootstrap, iOS, Android
- And many more...

## Edge Features

- Multiple edge styles (straight, orthogonal, entity relation)
- Arrow types (classic, block, diamond, oval, etc.)
- Edge labels with positioning
- Waypoints and routing
- Dashed/dotted lines

## Architecture

```
lib/
├── index.ts              # Main entry point
├── convert.ts            # High-level convert() function
├── parser.ts             # DrawIO XML parser
├── renderer.ts           # SVG renderer (4000+ lines)
├── decompress.ts         # Compressed content handler
├── svg-builder.ts        # DOM-based SVG construction
├── stencils.ts           # Stencil bundle management
├── text-measure.ts       # Text measurement abstraction
├── edge-router/          # Edge routing algorithms
│   ├── perimeter/        # Perimeter point calculation
│   └── utils/            # Routing utilities
└── renderer/             # Renderer components
    ├── shapes/           # Shape handlers (50+ modules)
    ├── edge/             # Edge rendering
    ├── text/             # Text/label rendering
    └── ...               # Color, geometry, styles
```

## Data Types

### ParsedDrawio
```typescript
interface ParsedDrawio {
  diagrams: Diagram[];
}

interface Diagram {
  id: string;
  name: string;
  model: MxGraphModel;
  cells: MxCell[];
}

interface MxCell {
  id: string;
  value?: string;
  style: MxStyle;
  parent?: string;
  source?: string;
  target?: string;
  vertex?: boolean;
  edge?: boolean;
  geometry?: MxGeometry;
}
```

## Dependencies

- **pako** - For deflate/inflate compression

## License

MIT
