import { useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import UsersTable from './usersTable.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UsersListingPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    const search = params.get('q') || '';
    const limit = parseInt(params.get('limit') || '10', 10);
    return { page, search, limit };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { page, search, limit } = getQueryParams();
      const filters = {
        page,
        limit,
        ...(search && { search }),
      };

      try {
        const { data } = await axios.get('http://localhost:8001/api/user/all', {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        
        setTotalUsers(data.totalPages);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getQueryParams]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 m-5">
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${totalUsers})`}
          description="Manage Users"
        />
      </div>
      <Separator />
      <UsersTable data={users} totalData={totalUsers} />
    </div>
  );
}
