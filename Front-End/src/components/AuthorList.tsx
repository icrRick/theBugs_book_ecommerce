import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authorService } from '../services/authorService';
import { AuthorDTO } from '../types/author';
import { Card, Row, Col, Pagination } from 'antd';

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, [currentPage]);

    const fetchAuthors = async () => {
        try {
            const response = await authorService.getAllAuthors(currentPage);
            setAuthors(response.data.content);
            setTotal(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Danh sách tác giả</h1>
            <Row gutter={[16, 16]}>
                {authors.map((author) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={author.id}>
                        <Card
                            hoverable
                            cover={<img alt={author.name} src={author.urlImage} className="h-48 object-cover" />}
                            onClick={() => navigate(`/author/${author.id}`)}
                        >
                            <Card.Meta title={author.name} />
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="mt-8 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={10}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AuthorList; 