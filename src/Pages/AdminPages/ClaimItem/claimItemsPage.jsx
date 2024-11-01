import { useCallback, useEffect, useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ClaimsTable from './ClaimItemsTable';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

export default function ClaimItemsListingPage() {
    const [claims, setClaims] = useState([]);
    const [totalClaims, setTotalClaims] = useState(0);

    const getQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page') || '1', 10);
        const search = params.get('q') || '';
        const limit = parseInt(params.get('limit') || '10', 10);
        return { page, search, limit };
    };

    const fetchClaims = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8001/api/claim', {
                params: getQueryParams(),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                const claimsWithRefresh = response.data.claims.map(claim => ({
                    ...claim,
                    refreshData: fetchClaims
                }));
                setClaims(claimsWithRefresh);
                setTotalClaims(response.data.totalPages);
            }
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch claims. Please try again."
            });
        }
    }, [getQueryParams]);

    useEffect(() => {
        fetchClaims();
    }, []);


    return (
        <div className="space-y-4 m-5">
            <div className="flex items-start justify-between">
                <Heading
                    title={`CLaims (${totalClaims})`}
                    description="Manage Claims"
                />
            </div>
            <Separator />
            <ClaimsTable data={claims} totalData={totalClaims} />
        </div>
    );
}
