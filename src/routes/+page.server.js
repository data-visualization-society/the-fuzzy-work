// @ts-nocheck

// import { fetchDataset } from "$lib/utilities/dataLoader";
import { readDataset } from '$lib/utilities/dataReader.js';
import { ascending, rollup, sum, max, descending } from 'd3';

export const prerender = true;

export async function load() {
    // const proj = "/the-fuzzy-work/"

    const [industryRelationships, layoffEvents] = await Promise.all([
        readDataset('IndustryRelationships.csv'),
        readDataset('TechLayoffs.csv')
    ]);

    const filteredEvents = layoffEvents.filter(d => d.layoff != null)

    const simplifyStage = (stage) => {
        switch (stage) {
            case "Post-IPO":
                return "Public";
            case "Acquired":
            case "Subsidiary":
            case "Private Equity":
                return "Private"
            case "Unknown":
            case null:
                return "Unknown";
            case "Seed":
            case "Series A":
            case "Series B":
                return "Early Stage";
            case "Series C":
            case "Series D":
                return "Mid Stage";
            default:
                return "Late Stage";
        }
    }

    const layoffByCompany = Array.from(
        rollup(
            filteredEvents,
            (v) => {
                const totalLayoff = sum(v, d => d.layoff);
                const maxPercent = max(v, d => parseFloat(d.percentage));
                const { stage, industry } = v[0];
                return {
                    layoff: totalLayoff,
                    percentage: maxPercent,
                    stage: simplifyStage(v[0].stage),
                    industry,
                    events: v.map((d) => {
                        return {
                            date: d.date,
                            layoff: d.layoff,
                            percentage: d.percentage,
                            location: d.location,
                            country: d.country
                        }
                    })
                };
            },
            (d) => d.company
        ),
        ([company, values]) => ({ company, ...values })
    );

    return {
        layoffByCompany: layoffByCompany,
        relationships: industryRelationships,
        theme: "light"
    }
}
