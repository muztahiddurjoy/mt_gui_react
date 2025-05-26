export function getUVColor(uvIndex: number): string {
    if (uvIndex >= 0 && uvIndex < 3) {
        return '#3EA72D'; // Green (Low)
    } else if (uvIndex >= 3 && uvIndex < 6) {
        return '#FFF300'; // Yellow (Moderate)
    } else if (uvIndex >= 6 && uvIndex < 8) {
        return '#F18B00'; // Orange (High)
    } else if (uvIndex >= 8 && uvIndex < 11) {
        return '#E53210'; // Red (Very High)
    } else if (uvIndex >= 11) {
        return '#B567A4'; // Violet (Extreme)
    } else {
        return '#CCCCCC'; // Gray for invalid values
    }
}