// Custom hook để sử dụng context
import {createContext, useContext} from "react";

// Tạo context
export const CreateCVContext = createContext(undefined);

export const useCreateCV = () => {
    const context = useContext(CreateCVContext);
    if (!context) throw new Error('useCreateCV must be used within a CreateCVProvider');
    return context;
};

