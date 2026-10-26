interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  selected: string;
  onTabClick: (tab: Tab) => void;
}

export default function Tabs({ tabs, selected, onTabClick }: TabsProps) {
  return (
    <div className="self-stretch justify-start items-center flex flex-wrap">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="self-stretch px-1 pt-4 pb-0 rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-center gap-1 inline-flex cursor-pointer"
          onClick={() => onTabClick(tab)}
        >
          <div className="flex items-center grow shrink basis-0 ">
            <p
              className={`min-w-20 text-center ${
                selected === tab.id
                  ? "text-grey-80 font-semibold"
                  : "text-grey-70"
              } text-base leading-[40px] capitalize whitespace-nowrap`}
            >
              {tab?.label}
            </p>
          </div>
          {selected === tab.id ? (
            <div className="self-stretch h-1 bg-blue-40 rounded-tl-sm rounded-tr-sm" />
          ) : (
            <div className="self-stretch h-1 rounded-tl-sm rounded-tr-sm" />
          )}
        </div>
      ))}
    </div>
  );
}
