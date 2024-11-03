import { useCallback, useEffect, useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ItemsTable from './ItemsTable';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

export default function ItemsListingPage() {
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getQueryParams = useCallback(() => {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const search = searchParams.get('q') || '';
        const status = searchParams.get('status') || '';
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        return { page, search, status, limit };
    }, [searchParams]);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8001/api/item/q/', {
                params: getQueryParams(),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                const itemsWithRefresh = response.data.items.map(item => ({
                    ...item,
                    refreshData: fetchItems
                }));
                setItems(itemsWithRefresh);
                setTotalItems(response.data.totalItems);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch items. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }, [getQueryParams]);

    useEffect(() => {
        fetchItems();
    }, [searchParams, fetchItems]);

    return (
        <div className="space-y-4 m-5">
            <div className="flex items-start justify-between">
                <Heading
                    title={`Reports (${totalItems})`}
                    description="Manage Reported Lost/Found Items"
                />
            </div>
            <Separator />
            <ItemsTable data={items} totalData={totalPages} />
        </div>
    );
}