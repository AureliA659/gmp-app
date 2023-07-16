import React, { useState } from 'react';
import { Nav, Table, Button, Form } from 'react-bootstrap';
import { deleteUser } from 'firebase/auth';
import { auth } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Row, Col } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import AdminNavBar from './AdminNavBar';
import './AdminCSS.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('');
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [editedData, setEditedData] = useState({});

  const handleTabSelect = async (selectedKey) => {
    setActiveTab(selectedKey);
    if (selectedKey === 'show_user') {
      getUsers();
    } else if (selectedKey === 'show_provider') {
      getProviders();
    }
  };

  const getUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getProviders = async () => {
    try {
      const providersRef = collection(db, 'providers');
      const querySnapshot = await getDocs(providersRef);
      const providersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setProviders(providersData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        // Delete from Firestore collection
        await deleteDoc(doc(db, 'users', userId));

        // Delete from authentication service
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          await deleteDoc(doc(db, 'users', user.uid));
          await deleteUser(user);
        }

        // Update the users list
        getUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeleteProvider = async (providerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this provider?');
    if (confirmDelete) {
      try {
        // Delete from Firestore collection
        await deleteDoc(doc(db, 'providers', providerId));

        // Delete from authentication service
        const user = auth.currentUser;
        if (user && user.uid === providerId) {
          await deleteDoc(doc(db, 'providers', user.uid));
          await deleteUser(user);
        }

        // Update the providers list
        getProviders();
      } catch (error) {
        console.error('Error deleting provider:', error);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditedData({ ...user });
  };

  const handleEditProvider = (provider) => {
    setEditedData({ ...provider });
  };

  const handleSaveEdit = async (id) => {
    try {
      if (activeTab === 'show_user') {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, editedData);
        getUsers();
      } else if (activeTab === 'show_provider') {
        const providerRef = doc(db, 'providers', id);
        await updateDoc(providerRef, editedData);
        getProviders();
      }
      setEditedData({});
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({});
  };

  return (
    <>
      <div>
        <AdminNavBar />
      </div>
      <div className="main_div_admin">
        <Row>
          <Col>
            <Nav id="select_bar" fill onSelect={handleTabSelect}>
              <Nav.Link className="tab_side" eventKey="show_user">
                Users
              </Nav.Link>
              <Nav.Link className="tab_side" eventKey="show_provider">
                Providers
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row style={{ marginTop: '70px' }}>
          {activeTab === 'show_user' && (
            <div className="admin_table">
              <h4>Users Table</h4>
              <Table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Pseudo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.user_id}</td>
                      <td>
                        {editedData.id === user.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.pseudo || ''}
                            onChange={(e) => setEditedData({ ...editedData, pseudo: e.target.value })}
                          />
                        ) : (
                          user.pseudo
                        )}
                      </td>
                      <td>
                        {editedData.id === user.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.firstName || ''}
                            onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                          />
                        ) : (
                          user.firstName
                        )}
                      </td>
                      <td>
                        {editedData.id === user.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.lastName || ''}
                            onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                          />
                        ) : (
                          user.lastName
                        )}
                      </td>
                      <td>{user.mail}</td>
                      <td>
                        {editedData.id === user.id ? (
                          <>
                            <Button variant="link" onClick={() => handleSaveEdit(user.id)}>
                              Save
                            </Button>
                            <Button variant="link" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button variant="link" onClick={() => handleEditUser(user)}>
                            <BsPencilSquare />
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button variant="link" onClick={() => handleDeleteUser(user.user_id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {activeTab === 'show_provider' && (
            <div className="admin-table">
              <h4>Providers Table</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Provider ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Activity Name</th>
                    <th>Phone</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider.id}>
                      <td>{provider.user_id}</td>
                      <td>
                        {editedData.id === provider.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.first_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })}
                          />
                        ) : (
                          provider.first_name
                        )}
                      </td>
                      <td>
                        {editedData.id === provider.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.last_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })}
                          />
                        ) : (
                          provider.last_name
                        )}
                      </td>
                      
                      <td>{provider.email}</td>
                      <td>
                        {editedData.id === provider.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.activity_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, activity_name: e.target.value })}
                          />
                        ) : (
                          provider.activity_name
                        )}
                      </td>
                      <td>
                        {editedData.id === provider.id ? (
                          <Form.Control
                            type="text"
                            value={editedData.phone || ''}
                            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          />
                        ) : (
                          provider.phone
                        )}
                      </td>
                      <td>
                        {editedData.id === provider.id ? (
                          <>
                            <Button variant="link" onClick={() => handleSaveEdit(provider.id)}>
                              Save
                            </Button>
                            <Button variant="link" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button variant="link" onClick={() => handleEditProvider(provider)}>
                            <BsPencilSquare />
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button variant="link" onClick={() => handleDeleteProvider(provider.user_id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Row>
      </div>
    </>
  );
}

export default AdminPage;
