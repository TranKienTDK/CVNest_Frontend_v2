// TabsComponents.jsx
import React, { useState } from "react";

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  console.log(`[TabsComponents] Tabs rendered with defaultValue: ${defaultValue}, activeTab: ${activeTab}`);
  
  // Log when tab changes
  React.useEffect(() => {
    console.log(`[TabsComponents] Tab value changed to: ${activeTab}`);
  }, [activeTab]);
  
  return (
    <div className="tabs-root" data-state={activeTab}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { 
          activeTab, 
          setActiveTab 
        });
      })}
    </div>
  );
};

export const TabsList = ({ children, className, activeTab, setActiveTab }) => {
  return (
    <div
      className={`inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ${
        className || ""
      }`}
      role="tablist"
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { 
          activeTab,
          setActiveTab
        });
      })}
    </div>
  );
};

export const TabsTrigger = ({ children, value, className, activeTab, setActiveTab }) => {
  const isActive = activeTab === value;
  
  console.log(`[TabsComponents] TabsTrigger rendering: value=${value}, activeTab=${activeTab}, isActive=${isActive}`);
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-background text-foreground shadow"
          : "hover:bg-background/50 hover:text-foreground"
      } ${className || ""}`}
      onClick={() => {
        console.log(`[TabsComponents] TabsTrigger clicked, setting value to: ${value}`);
        if (typeof setActiveTab === 'function') {
          setActiveTab(value);
        } else {
          console.error('[TabsComponents] setActiveTab is not a function:', setActiveTab);
        }
      }}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className, activeTab }) => {
  const isActive = activeTab === value;
  
  console.log(`[TabsComponents] TabsContent for value=${value}, activeTab=${activeTab}, shouldRender=${isActive}`);
  
  if (!isActive) {
    console.log(`[TabsComponents] TabsContent not rendering for ${value} because activeTab is ${activeTab}`);
    return null;
  }
  
  console.log(`[TabsComponents] TabsContent RENDERING for ${value}`);
  return (
    <div
      role="tabpanel"
      data-state="active"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};
