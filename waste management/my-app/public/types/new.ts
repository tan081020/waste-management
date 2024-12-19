 export interface NewsItem {
  id: number;
  description: string;
  imageUrl:string
  content: string;
  author: string;
  createAt: Date;
  category: string; // Danh mục mới
}

