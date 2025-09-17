import React from "react";

// Color interface
interface ColorToken {
  name: string;
  value: string;
  className: string;
  description: string;
}

// Font Size interface
interface FontSizeToken {
  name: string;
  className: string;
  size: string;
  lineHeight: string;
  fontWeight: string;
  description: string;
}

// Border Radius interface
interface BorderRadiusToken {
  name: string;
  className: string;
  value: string;
  description: string;
}

// Color tokens from tailwind config
export const colorTokens: ColorToken[] = [
  // Gray colors
  { name: "gray-gc1b", value: "#070C1B", className: "bg-gray-gc1b", description: "Dark gray background" },
  { name: "gray-g63f", value: "#21263F", className: "bg-gray-g63f", description: "Medium dark gray" },
  { name: "gray-gf7e", value: "#565F7E", className: "bg-gray-gf7e", description: "Medium gray" },
  { name: "gray-g3b0", value: "#8B93B0", className: "bg-gray-g3b0", description: "Light gray" },
  { name: "gray-gedd", value: "#C8CEDD", className: "bg-gray-gedd", description: "Very light gray" },
  
  // White colors
  { name: "white-wfff", value: "#FFFFFF", className: "bg-white-wfff", description: "Pure white" },
  
  // Blue colors
  { name: "blue-bbee", value: "#4E7BEE", className: "bg-blue-bbee", description: "Primary blue" },
  { name: "blue-b9a8", value: "#1E29A8", className: "bg-blue-b9a8", description: "Dark blue" },
  { name: "blue-b580", value: "#0C1580", className: "bg-blue-b580", description: "Darker blue" },
  { name: "blue-b525", value: "#101525", className: "bg-blue-b525", description: "Darkest blue" },
  
  // Green colors
  { name: "green-g372", value: "#00A372", className: "bg-green-g372", description: "Success green" },
  
  // Red colors
  { name: "red-r64b", value: "#E5364B", className: "bg-red-r64b", description: "Error red" },
];

// Font size tokens from tailwind config
export const fontSizeTokens: FontSizeToken[] = [
  // Headline styles
  { name: "f-56", className: "text-f-56", size: "56px", lineHeight: "64px", fontWeight: "700", description: "Large headline" },
  { name: "f-36", className: "text-f-36", size: "36px", lineHeight: "44px", fontWeight: "700", description: "Medium headline" },
  { name: "f-24", className: "text-f-24", size: "24px", lineHeight: "30px", fontWeight: "700", description: "Small headline" },
  { name: "f-20", className: "text-f-20", size: "20px", lineHeight: "26px", fontWeight: "700", description: "Extra small headline" },
  
  // Body styles
  { name: "fm-16", className: "text-fm-16", size: "16px", lineHeight: "24px", fontWeight: "500", description: "Body medium 16px" },
  { name: "fr-16", className: "text-fr-16", size: "16px", lineHeight: "24px", fontWeight: "400", description: "Body regular 16px" },
  { name: "fm-14", className: "text-fm-14", size: "14px", lineHeight: "20px", fontWeight: "500", description: "Body medium 14px" },
  { name: "fr-14", className: "text-fr-14", size: "14px", lineHeight: "20px", fontWeight: "400", description: "Body regular 14px" },
  { name: "fm-12", className: "text-fm-12", size: "12px", lineHeight: "18px", fontWeight: "500", description: "Body medium 12px" },
  { name: "fr-12", className: "text-fr-12", size: "12px", lineHeight: "18px", fontWeight: "400", description: "Body regular 12px" },
];

// Border radius tokens from tailwind config
export const borderRadiusTokens: BorderRadiusToken[] = [
  { name: "lg", className: "rounded-lg", value: "var(--radius)", description: "Large border radius" },
  { name: "md", className: "rounded-md", value: "calc(var(--radius) - 2px)", description: "Medium border radius" },
  { name: "sm", className: "rounded-sm", value: "calc(var(--radius) - 4px)", description: "Small border radius" },
];

// Color display component
interface ColorDisplayProps {
  color: ColorToken;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-16 h-16 rounded-lg border border-gray-300 ${color.className}`}></div>
      <div className="text-center">
        <div className="text-sm font-mono text-gray-800">{color.name}</div>
        <div className="text-xs text-gray-600">{color.value}</div>
        <div className="text-xs text-gray-500 mt-1">{color.description}</div>
        <div className="text-xs font-mono text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded">
          {color.className}
        </div>
      </div>
    </div>
  );
};

// Font size display component
interface FontSizeDisplayProps {
  fontSize: FontSizeToken;
}

export const FontSizeDisplay: React.FC<FontSizeDisplayProps> = ({ fontSize }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`${fontSize.className} text-gray-800 text-center`}>
        Aa
      </div>
      <div className="text-center">
        <div className="text-sm font-mono text-gray-800">{fontSize.name}</div>
        <div className="text-xs text-gray-600">{fontSize.size} / {fontSize.lineHeight}</div>
        <div className="text-xs text-gray-500 mt-1">{fontSize.description}</div>
        <div className="text-xs font-mono text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded">
          {fontSize.className}
        </div>
      </div>
    </div>
  );
};

// Border radius display component
interface BorderRadiusDisplayProps {
  borderRadius: BorderRadiusToken;
}

export const BorderRadiusDisplay: React.FC<BorderRadiusDisplayProps> = ({ borderRadius }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-16 h-16 bg-blue-500 ${borderRadius.className}`}></div>
      <div className="text-center">
        <div className="text-sm font-mono text-gray-800">{borderRadius.name}</div>
        <div className="text-xs text-gray-600">{borderRadius.value}</div>
        <div className="text-xs text-gray-500 mt-1">{borderRadius.description}</div>
        <div className="text-xs font-mono text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded">
          {borderRadius.className}
        </div>
      </div>
    </div>
  );
};

// Colors grid component
interface ColorsGridProps {
  columns?: number;
}

export const ColorsGrid: React.FC<ColorsGridProps> = ({ columns = 4 }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Color Tokens</h2>
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {colorTokens.map((color, index) => (
          <ColorDisplay key={index} color={color} />
        ))}
      </div>
    </div>
  );
};

// Font sizes grid component
interface FontSizesGridProps {
  columns?: number;
}

export const FontSizesGrid: React.FC<FontSizesGridProps> = ({ columns = 3 }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Font Size Tokens</h2>
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {fontSizeTokens.map((fontSize, index) => (
          <FontSizeDisplay key={index} fontSize={fontSize} />
        ))}
      </div>
    </div>
  );
};

// Border radius grid component
interface BorderRadiusGridProps {
  columns?: number;
}

export const BorderRadiusGrid: React.FC<BorderRadiusGridProps> = ({ columns = 3 }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Border Radius Tokens</h2>
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {borderRadiusTokens.map((borderRadius, index) => (
          <BorderRadiusDisplay key={index} borderRadius={borderRadius} />
        ))}
      </div>
    </div>
  );
};

// Main design tokens component
interface DesignTokensProps {
  showColors?: boolean;
  showFontSizes?: boolean;
  showBorderRadius?: boolean;
  columns?: number;
}

export const DesignTokens: React.FC<DesignTokensProps> = ({ 
  showColors = true, 
  showFontSizes = true, 
  showBorderRadius = true,
  columns = 4 
}) => {
  return (
    <div className="w-full space-y-12">
      {showColors && <ColorsGrid columns={columns} />}
      {showFontSizes && <FontSizesGrid columns={3} />}
      {showBorderRadius && <BorderRadiusGrid columns={3} />}
    </div>
  );
};

export default DesignTokens;
