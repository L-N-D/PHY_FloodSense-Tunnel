import systemModel from "./system.model.js";

export const getSystemLogsService = async () => {

    const res = systemModel.find().sort({ createdAt: -1 })
    .select('device action createdAt -_id')
    .limit(10)
    .lean();

    if (!res){
        return [];
    }
    return res;

}