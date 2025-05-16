import React from "react";
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {MenuOutlined} from "@ant-design/icons";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {cn} from "@/lib/utils.js";
import {Trash} from "lucide-react";

import {listDetailInfoDefs} from "@/pages/user/my-cv/contexts/defs";

// Item hiển thị 1 dòng
function SortableItem({id, value}) {
    const {listDetailInfoShowing, setListDetailInfoShowing} = useCreateCV();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-2 mb-2"
        >
            <div className="flex items-center space-x-2">
                {/* Icon kéo thả */}
                <MenuOutlined
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-gray-500 hover:text-black"
                />
                <span className="text-red-600">{value}</span>
            </div>
            {listDetailInfoShowing.includes(id) ? (
                <button
                    className={cn(
                        "bg-red-600 text-white px-3 py-1 text-sm rounded hover:opacity-80 transition",
                        "flex gap-1 items-center"
                    )}
                    onClick={() => {
                        setListDetailInfoShowing(prev => {
                            const newList = [...prev];
                            const index = newList.indexOf(id);
                            if (index > -1) {
                                newList.splice(index, 1);
                            }
                            return newList;
                        });
                    }}
                >
                    Xóa
                    <Trash className={cn("size-3")}/>
                </button>
            ) : (
                <button
                    className="bg-[#a1a1a1] text-white px-3 py-1 text-sm rounded hover:opacity-80 transition"
                    onClick={() => {
                        setListDetailInfoShowing(prev => [
                            ...prev,
                            id
                        ])
                    }}
                >
                    Thêm +
                </button>
            )}
        </div>
    );
}

function OtherInfoSection() {
    const {listDetailInfo, setListDetailInfo} = useCreateCV();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setListDetailInfo((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-700">Thông tin khác</h2>
                <span className="text-sm text-gray-500">Kéo để sắp xếp</span>
            </div>

            {/* Danh sách có thể kéo */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={listDetailInfo}
                    strategy={verticalListSortingStrategy}
                >
                    {listDetailInfo.map((id) => (
                        <SortableItem key={id} id={id} value={listDetailInfoDefs[id].label}/>
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
}

export default OtherInfoSection;
