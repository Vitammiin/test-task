import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Audio from "../pages/Audio";
import FormComponent from "../pages/Form";
import Stock from "../pages/Stock";

export default function TabsComponent() {
  const tabs = [
    {
      id: "audio",
      label: "Audio",
      content: <Audio />,
    },
    {
      id: "form",
      label: "Form",
      content: <FormComponent />,
    },
    {
      id: "stock",
      label: "Stock",
      content: <Stock />,
    },
  ];

  return (
    <div className="flex flex-col mx-auto bg-none">
      <Tabs
        aria-label="Dynamic Tabs with Components"
        items={tabs}
        variant="bordered"
        className="justify-center bg-white"
        classNames={{
          base: '!bg-none !bg-transparent',
          tabList:
            "gap-6 relative rounded-lg border-1 border-divider ",
          cursor: "w-full",
          tab: "px-5 h-12 gradient-border",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
