import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authorService } from '../services/authorService';
import { AuthorDetailResponse } from '../types/author';
import { Card, Row, Col, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const AuthorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [authorDetail, setAuthorDetail] = useState<AuthorDetailResponse | null>(null);

    useEffect(() => {
        fetchAuthorDetail();
    }, [id]);

    const fetchAuthorDetail = async () => {
        try {
            if (id) {
                const response = await authorService.getAuthorDetail(parseInt(id));
                setAuthorDetail(response.data);
            }
        } catch (error) {
            console.error('Error fetching author detail:', error);
        }
    };

    if (!authorDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <img
                            src={authorDetail.author.urlImage}
                            alt={authorDetail.author.name}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </Col>
                    <Col xs={24} md={16}>
                        <Title level={2}>{authorDetail.author.name}</Title>
                        <Paragraph>
                            <a href={authorDetail.author.urlLink} target="_blank" rel="noopener noreferrer">
                                Xem thêm về tác giả
                            </a>
                        </Paragraph>
                    </Col>
                </Row>
            </div>

            <Divider />

            <Title level={3}>Tác phẩm</Title>
            <Row gutter={[16, 16]}>
                {authorDetail.products.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                        <Card
                            hoverable
                            cover={<img alt={product.productName} src={product.productImage} className="h-48 object-cover" />}
                        >
                            <Card.Meta title={product.productName} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AuthorDetail; 