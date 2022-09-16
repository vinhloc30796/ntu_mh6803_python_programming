import { 
    init_coin, 
    init_start_date, 
    init_end_date,
    init_starting_asset,
    init_retirement_goal,
 } from "../components/_consts";

export const extractRetirementYears = async (
    coin: string,
    start_date: Date, 
    end_date: Date, 
    starting_asset: number,
    retirement_goal: number
): Promise<number> => {
    const start_date_str = start_date.toISOString().split("T")[0];
    const end_date_str = end_date.toISOString().split("T")[0];
    const response: Response = await fetch(
        `${process.env.BACKEND_URL}/retirement/${coin}?starting_asset=${starting_asset}&retirement_goal=${retirement_goal}&start_date=${start_date_str}&end_date=${end_date_str}`
    )
    const response_json = await response.json();
    const years_to_retire = response_json["years_to_retire"];
    console.log(
        "extractRetirementYears", 
        "response", response,
        "response_json", response_json,
        "years_to_retire", years_to_retire
    )
    return years_to_retire;
}

export const dummyYears = extractRetirementYears(
    init_coin, 
    init_start_date, 
    init_end_date,
    init_starting_asset,
    init_retirement_goal,
)