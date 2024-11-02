import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Link,
    Skeleton,
    IconButton,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import { OpenInNew, School } from '@mui/icons-material';
import { fetchEducationNews } from '../../app/services/newsService';
import { useSession } from 'next-auth/react';
import sanitizeHtml from '../../app/utils/sanitizeHtml';

const NewsContainer = styled(Box)(({ theme }) => ({
    width: '300px',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginLeft: theme.spacing(3),
    height: 'fit-content',
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
}));

const NewsCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
}));

const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const loadNews = async () => {
            if (session?.userDetails) {
                const newsData = await fetchEducationNews(session.userDetails.department.departmentName);
                setNews(newsData);
            }
            setLoading(false);
        };

        loadNews();
    }, [session]);

    const getNewsTitle = () => {
        if (session?.userDetails?.department) {
            return `${session.userDetails.department.departmentName} News`;
        }
        return 'Education News';
    };

    return (
        <NewsContainer>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                pb: 1
            }}>
                <School color="primary" />
                <Typography variant="h6" fontWeight={600}>
                    {getNewsTitle()}
                </Typography>
            </Box>

            {loading ? (
                [...Array(3)].map((_, index) => (
                    <NewsCard key={index}>
                        <Skeleton variant="rectangular" height={140} />
                        <CardContent>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                        </CardContent>
                    </NewsCard>
                ))
            ) : (
                news.map((item) => (
                    <NewsCard key={item.id}>
                        {item.fields?.thumbnail && (
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.fields.thumbnail}
                                alt={item.fields.headline}
                            />
                        )}
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                {sanitizeHtml(item.fields.headline)}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                paragraph
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {sanitizeHtml(item.fields.trailText)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="Read full article">
                                    <IconButton 
                                        size="small" 
                                        component={Link} 
                                        href={item.webUrl} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <OpenInNew fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </NewsCard>
                ))
            )}
        </NewsContainer>
    );
};

export default NewsWidget; 