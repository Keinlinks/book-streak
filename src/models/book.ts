export interface Book {
    id?: string;
    title: string;
    author: string;
    progress: number;
    totalPage: number;
    image?: string;
    rating?: number;
}
