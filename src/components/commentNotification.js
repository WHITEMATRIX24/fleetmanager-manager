import React, { useState, useEffect } from 'react';
import './CommentNotification.css';

function CommentNotification({ onClose }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/comments');
                const data = await response.json();
                setComments(data.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    const handleDelete = async (commentId) => {
        try {
            await fetch(`http://localhost:5000/api/comments/${commentId}`, { method: 'DELETE' });
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comment-notification">
            <div className="comment-notification-content">
                <h2>COMMENTS</h2>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <div>Vehicle Number: {comment.vehicleNumber}</div>
                            <div>Driver ID: {comment.driverId}</div>
                            <div>Comment Detail: {comment.commentDetail}</div>
                            <button onClick={() => alert(comment.commentImage ? comment.commentImage : 'No image')}>View Details</button>
                            <button onClick={() => handleDelete(comment._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default CommentNotification;
