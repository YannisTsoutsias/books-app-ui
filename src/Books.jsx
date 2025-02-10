import { useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
function Books({role, onLogout }) {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", author: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);


  const BASE_URL = "http://localhost:8080/api/books";
  const USERS_URL = "http://localhost:8080/api/users";

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/books", {
        withCredentials: true,
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Headers:", error.response.headers);
      }
      setError("❌ Failed to fetch books. Check console for details.");
    }
  };

  const fetchUsers = async () => {
    // if (role === "admin") {
      try {
        const response = await axios.get(USERS_URL, { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("❌ Failed to fetch users. Check console for details.");
      }
    // }`
  };

  const addBook = async () => {
    if (!form.title || !form.author) {
      setError("Both title and author are required.");
      return;
    }
    try {
      const response = await axios.post(BASE_URL, {
        title: form.title,
        author: form.author,
      }, { withCredentials: true }); 
      setBooks((prev) => [...prev, response.data]);
      setForm({ id: null, title: "", author: "" });
      setError("");
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again later.");
    }
  };

  const editBook = (id) => {
    const bookToEdit = books.find((book) => book.id === id);
    if (bookToEdit) {
      setForm(bookToEdit);
      setIsEditing(true);
    }
  };
  const updateBook = async () => {
    if (!form.title || !form.author) {
      setError("Both title and author are required.");
      return;
    }
    try {
      const response = await axios.put(`${BASE_URL}/${form.id}`, {
        title: form.title,
        author: form.author,
      }, { withCredentials: true }); 
      setBooks((prev) =>
        prev.map((book) => (book.id === form.id ? response.data : book))
      );
      setForm({ id: null, title: "", author: "" });
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again later.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true }); 
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h3>Welcome, {role}!</h3>
      <h1>Books Manager</h1>
      
      <button
        onClick={onLogout}
        style={{
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>

      <div>
          <h2>Users List</h2>
          {users.length > 0 ? (
            <ul style={{ listStyle: "none", padding: "0" }}>
              {users.map((user) => (
                <li
                  key={user.id}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <div>{user.username}</div>
                  <div>{user.roles.map((r) => r.authority).join(", ")}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users available.</p>
          )}
        </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {isEditing ? (
          <button
            onClick={updateBook}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Update Book
          </button>
        ) : (
          <button
            onClick={addBook}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Book
          </button>
        )}
      </div>
      <div>
        <h2>Books List</h2>
        {books.length > 0 ? (
          <ul style={{ listStyle: "none", padding: "0" }}>
            {books.map((book) => (
              <li
                key={book.id}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{book.title}</strong> by {book.author}
                </div>
                <div>
                  <button
                    onClick={() => editBook(book.id)}
                    style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#ffc107",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books available. Add some books!</p>
        )}
      </div>
    </div>
  );
}

export default Books;