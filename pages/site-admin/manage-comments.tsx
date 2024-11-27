import React, { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Avatar from "@/frontend/components/Avatar";
import {
  StateContext as UserStateContext,
  DispatchContext as UserDispatchContext,
} from "@/frontend/contexts/UserContext";
import api from "@/frontend/utils/api";
import withAuth from "@/frontend/utils/auth";
import AdminPortalLayout from "@/frontend/components/AdminPortalLayout";
import AdminManageContentLayout from "@/frontend/components/AdminManageContentLayout";
import { ITEMS_PER_PAGE } from "@/constants";
import CommentCard from "@/frontend/components/BlogPostOrCommentCard";

const ManageComments = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    setLoading(true);
    const params = {
      page: 1,
      pageSize: ITEMS_PER_PAGE,
      sort: "desc",
    };
    try {
      const { data } = await api.get("/comments/admin-get-all", { params });
      setComments(data.comments);
      setTotalPages(Math.ceil(data.total / data.pageSize));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setUpdate((prev) => !prev);
  }

  useEffect(() => {
    fetchComments();
}, [update]);

  return (
    <AdminPortalLayout>
      <h3 className="text-2xl font-semibold text-center mb-10 dark:text-white">
        Manage Comments
      </h3>
      <AdminManageContentLayout totalPages={totalPages} onUpdate={handleUpdate}>
        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading Comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No comments found.
            </p>
          ) : (
            <div>
              {comments.map((comment: any) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </AdminManageContentLayout>
    </AdminPortalLayout>
  );
};

export default withAuth(ManageComments, true);
