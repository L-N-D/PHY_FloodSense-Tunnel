import { getSystemLogsService } from "./system.service.js";

export const getSystemLogsController = async (req, res) => {

    const result = await getSystemLogsService();

    if (!result){
        return res.status(500).json({message: 'No data found'});
    }

    res.status(200).json(result);

}