import './App.css'
import {QueryClient, useMutation, useQuery} from '@tanstack/react-query';
import {useState} from "react";

const getPosts = () => fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json());
function App() {
    const queryClient = new QueryClient();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('')
    const {data, isLoading, error} = useQuery({
        queryKey: ['posts'],
        queryFn: () => getPosts(),
        // staleTime: 20000,
        // refetchInterval: 5000,
    })

    const {mutate, isPending, isError} = useMutation({
        mutationFn: async (dataPost: { title: string, body: string }) => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(dataPost),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            return await res.json();
        },
        onSuccess: () => {
            setTitle('');
            setBody('');
            queryClient.invalidateQueries({
                queryKey: ['posts']
            }).then(() => {
                alert('invalidateQueries')
            });
        }
    })
    if (error || isError) {
        return <h1>Error: {error?.message || 'there are errors'} </h1>
    }
    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <div>
                <div>
                    <p>New post</p>
                    <label>Title</label>
                    <input value={title} type="text" name={'title'} placeholder="Title"
                           onChange={(e) => setTitle(e.target.value)}/>
                    <hr/>
                    <label>Body</label>
                    <input value={body} type="text" name={'body'} placeholder="Body"
                           onChange={(e) => setBody(e.target.value)}/>
                    <hr/>
                    <button onClick={() => {
                        mutate({title, body})
                    }}>Post
                    </button>
                </div>
                <span>{isPending ? 'Pending post new data' : ''}</span>
                {data && data?.map((item: { id: string, title: string, body: string }) => (
                    <div key={item.id}>
                        <h2>ID: {item.id}</h2>
                        <h2>Title: {item.title}</h2>
                        <desc>{item.body}</desc>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App
