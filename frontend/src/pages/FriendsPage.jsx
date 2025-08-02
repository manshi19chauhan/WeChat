import { Link } from "react-router";
import { Users } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import FriendCard from "../components/FriendCard.jsx";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api.js";

const FriendsPage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["Friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <Users className="w-4 h-4 mr-2" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
