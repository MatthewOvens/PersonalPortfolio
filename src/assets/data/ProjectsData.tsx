
export interface ProjectData {
    title: string;
    location: string;
    description: string;
    image: string[];
    link: string;
}


const projectData : ProjectData[] = [{
    title: "SnacMan",
    location: "Personal Project - Milan, Italy",
    description: "This is a description of project 1",
    image: ["src\\assets\\images\\snacmanheader.png"],
    link: "https://www.google.com"
    },
    {
        title: "Project 2",
        location: "Personal Project - Milan, Italy",
        description: "This is a description of project 2",
        image: ["https://via.placeholder.com/150"],
        link: "https://www.google.com"
    },
    {
        title: "Snac-Man",
        location: "Personal Project - Milan, Italy",
        description: "A web-based snake game",
        image: ["src\\assets\\images\\snacmanheader.png"],
        link: "https://www.google.com"
    },
    {
        title: "Snac-Man",
        location: "Personal Project - Milan, Italy",
        description: "A web-based snake game",
        image: ["src\\assets\\images\\snacmanheader.png"],
        link: "https://www.google.com"
    }
]

export default projectData;