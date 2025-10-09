import React from "react";
import FilterSearch from "./FilterSearch";

// Example usage of FilterSearch component
const FilterSearchExample: React.FC = () => {
    const handleSearch = (filters: any) => {
        console.log("Search filters:", filters);
        // Here you would typically make an API call with the filters
        // Example: searchMovies(filters);
    };

    return (
        <div className="p-6 bg-gray-gc1b min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-white text-f-24 mb-6">Movie Filter Search</h1>
                <FilterSearch onSearch={handleSearch} />

                {/* Example of how to use the component in different contexts */}
                <div className="mt-8">
                    <h2 className="text-white text-f-20 mb-4">Usage Examples</h2>
                    <div className="space-y-4">
                        {/* Full width example */}
                        <div>
                            <h3 className="text-gray-g3b0 text-fm-16 mb-2">Full Width</h3>
                            <FilterSearch onSearch={handleSearch} />
                        </div>

                        {/* With custom className */}
                        <div>
                            <h3 className="text-gray-g3b0 text-fm-16 mb-2">With Custom Styling</h3>
                            <FilterSearch
                                onSearch={handleSearch}
                                className="border border-blue-bbee"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSearchExample;
