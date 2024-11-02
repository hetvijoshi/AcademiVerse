const GUARDIAN_API_KEY = '33e14e04-671d-4910-91c2-27e08020b37d';

const getDepartmentSpecificQuery = (department) => {
    // Map department names to relevant search queries
    const queryMap = {
        'Computer Science': 'technology OR computing OR artificial-intelligence OR software',
        'Law': 'law OR legal OR justice OR courts',
        'Business': 'business OR finance OR economics OR management',
        'Engineering': 'engineering OR technology OR innovation',
        'Medicine': 'medicine OR healthcare OR medical-research',
        // Add more departments as needed
    };

    // Default to technology if department not found
    return queryMap[department] || 'education';
};

export const fetchEducationNews = async (department) => {
    try {
        const searchQuery = getDepartmentSpecificQuery(department);
        const response = await fetch(
            `https://content.guardianapis.com/search?q=${searchQuery}&show-fields=thumbnail,headline,trailText&api-key=${GUARDIAN_API_KEY}&page-size=5`
        );
        const data = await response.json();
        return data.response.results;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}; 