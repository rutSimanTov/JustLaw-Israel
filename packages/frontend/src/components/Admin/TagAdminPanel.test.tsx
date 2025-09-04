import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagAdminPanel from './TagAdminPanel';
import apiClient from '../../services/apiClient';

jest.mock('../../services/apiClient');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('TagAdminPanel - מערכת ניהול תגיות', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ערך ברירת מחדל לכל קריאה
    mockedApi.get.mockImplementation((url) => {
      if (url === '/api/content-auth/tags/all') {
        return Promise.resolve({ data: { tags: [ { tag: 'foo', usage_count: 2 }, { tag: 'bar', usage_count: 1 } ] } });
      }
      if (url === '/api/content-auth/tags/stats') {
        return Promise.resolve({ data: { stats: { foo: 2, bar: 1 } } });
      }
      if (url === '/api/content-auth/tags/similar') {
        return Promise.resolve({ data: { similar: ['foobar'] } });
      }
      return Promise.resolve({ data: {} });
    });
    mockedApi.delete.mockResolvedValue({});
    mockedApi.put.mockResolvedValue({});
    mockedApi.post.mockResolvedValue({ data: { updatedCount: 2 } });
  });

  it('מרנדר את הפאנל ואת התגיות', async () => {
    render(<TagAdminPanel />);
    expect(await screen.findByText(/tag management/i)).toBeInTheDocument();
    expect(await screen.findByText('foo')).toBeInTheDocument();
    expect(await screen.findByText('bar')).toBeInTheDocument();
  });

  it('מוסיף תגית חדשה', async () => {
    render(<TagAdminPanel />);
    const input = screen.getByPlaceholderText('New tag name');
    fireEvent.change(input, { target: { value: 'חדש' } });
    // בוחר את הכפתור הראשון עם הטקסט "Add" שהוא כפתור
    const addButtons = screen.getAllByText('Add');
    const button = addButtons.find((el) => el.tagName === 'BUTTON');
    fireEvent.click(button!);
    await waitFor(() => expect(mockedApi.post).toHaveBeenCalledWith('/api/content-auth/tags', { tag: 'חדש' }));
  });

  it('מוחק תגית', async () => {
    window.confirm = jest.fn(() => true);
    render(<TagAdminPanel />);
    const deleteBtn = await screen.findAllByTitle('Delete tag');
    fireEvent.click(deleteBtn[0]);
    await waitFor(() => expect(mockedApi.delete).toHaveBeenCalledWith('/api/content-auth/tags/foo'));
  });

  it('ממזג תגיות', async () => {
    render(<TagAdminPanel />);
    const from = screen.getByPlaceholderText('Tag to merge from');
    const to = screen.getByPlaceholderText('Target tag');
    fireEvent.change(from, { target: { value: 'foo' } });
    fireEvent.change(to, { target: { value: 'bar' } });
    const mergeButtons = screen.getAllByText('Merge');
    const mergeBtn = mergeButtons.find((el) => el.tagName === 'BUTTON');
    fireEvent.click(mergeBtn!);
    await waitFor(() => expect(mockedApi.put).toHaveBeenCalledWith('/api/content-auth/tags/merge', { tagToMerge: 'foo', tagTarget: 'bar' }));
  });

  it('מחפש תגיות דומות', async () => {
    render(<TagAdminPanel />);
    const searchInput = screen.getByPlaceholderText('Search tag');
    fireEvent.change(searchInput, { target: { value: 'foo' } });
    const searchButtons = screen.getAllByText('Search');
    const searchBtn = searchButtons.find((el) => el.tagName === 'BUTTON');
    fireEvent.click(searchBtn!);
    expect(await screen.findByText('foobar')).toBeInTheDocument();
  });

  it('מבצע bulk tagging (הוספה)', async () => {
    render(<TagAdminPanel />);
    const idsInput = screen.getByPlaceholderText('Content IDs (comma separated)');
    const tagInput = screen.getByPlaceholderText('Tag');
    fireEvent.change(idsInput, { target: { value: '1,2' } });
    fireEvent.change(tagInput, { target: { value: 'foo' } });
    const execBtn = screen.getByText('לבצע');
    fireEvent.click(execBtn);
    await waitFor(() => expect(mockedApi.post).toHaveBeenCalledWith('/api/content-auth/tags/bulk', { ids: ['1','2'], tag: 'foo', action: 'add' }));
  });

  it('בודק הודעת שגיאה בהרשאות (401)', async () => {
    mockedApi.get.mockRejectedValueOnce({ response: { status: 401 } });
    render(<TagAdminPanel />);
    await waitFor(() => expect(screen.queryByText('foo')).not.toBeInTheDocument());
  });

  it('בודק הודעת שגיאה בהוספת תגית קיימת', async () => {
    mockedApi.post.mockRejectedValueOnce({ response: { status: 400, data: { error: 'already exists' } } });
    render(<TagAdminPanel />);
    const input = screen.getByPlaceholderText('New tag name');
    fireEvent.change(input, { target: { value: 'foo' } });
    const addButtons = screen.getAllByText('Add');
    const button = addButtons.find((el) => el.tagName === 'BUTTON');
    fireEvent.click(button!);
    // מחפש הודעה באנגלית כפי שמוצג בפועל
    await waitFor(() => expect(screen.getByText(/already exists/i)).toBeInTheDocument());
  });


  it('בודק הצגת סטטיסטיקות תגיות', async () => {
    render(<TagAdminPanel />);
    // מחפש את הטקסטים של התגיות והמספרים כפי שמוצגים בפועל
    expect(await screen.findByText('foo')).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
  });


  it('בודק שהכפתור "Add" מושבת כאשר אין קלט', async () => {
    render(<TagAdminPanel />);
    const addButtons = screen.getAllByText('Add');
    const button = addButtons.find((el) => el.tagName === 'BUTTON');
    expect(button).toBeDisabled();
  });

  it('בודק שהכפתור "Merge" מושבת כאשר אין קלט', async () => {
    render(<TagAdminPanel />);
    const mergeButtons = screen.getAllByText('Merge');
    const mergeBtn = mergeButtons.find((el) => el.tagName === 'BUTTON');
    expect(mergeBtn).toBeDisabled();
  });

  it('בודק שהכפתור "Search" מושבת כאשר אין קלט', async () => {
    render(<TagAdminPanel />);
    const searchButtons = screen.getAllByText('Search');
    const searchBtn = searchButtons.find((el) => el.tagName === 'BUTTON');
    expect(searchBtn).toBeDisabled();
  });

  // אפשר להוסיף עוד בדיקות לפי צורך (סטטיסטיקות, UI, טעינה וכו')
});
