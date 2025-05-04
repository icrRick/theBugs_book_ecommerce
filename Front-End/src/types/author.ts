export interface AuthorDTO {
    id: number;
    name: string;
    urlImage: string;
    urlLink: string;
}

export interface ProductAuthorDTO {
    productId: number;
    productName: string;
    productImage: string;
}

export interface AuthorDetailResponse {
    author: AuthorDTO;
    products: ProductAuthorDTO[];
} 