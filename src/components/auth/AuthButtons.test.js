import { render, screen } from "@testing-library/react";
import {MemoryRouter} from 'react-router-dom'
import { createServer, pause } from "../../test/server";
import AuthButtons from "./AuthButtons";
import { SWRConfig } from "swr";

async function renderComponent(){
    render(
        <SWRConfig value={{provider: ()=>new Map()}}>
            <MemoryRouter>
                <AuthButtons />
            </MemoryRouter>
        </SWRConfig>
    )

    await screen.findAllByRole('link');
}

describe('when user is signed in',()=>{
    const userMock = {id: 3, email: 'asdf@asdf.com'};

    createServer([{
        path: '/api/user',
        res: ()=>{
            return {
                user: userMock
            };
        }
    }])
    test('should not visible sign in and up', async()=>{
        await renderComponent();

        const singInButton = screen.queryByRole('link', {
            name: /sign in/i
        })
        const singUpButton = screen.queryByRole('link', {
            name: /sign up/i
        })
        
        expect(singInButton).not.toBeInTheDocument()
        expect(singUpButton).not.toBeInTheDocument()
        
    });
    test('should visible sign out', async()=>{
        await renderComponent();
        const singUpButton = screen.getByRole('link', {
            name: /sign out/i
        })

        expect(singUpButton).toBeInTheDocument();
        expect(singUpButton).toHaveAttribute('href','/signout');
    });
})

describe('when user is not signed in',()=>{
    createServer([{
        path: '/api/user',
        res: ()=>{
            return {
                user: null
            };
        }
    }])

    test('should visible sign in and up', async()=>{
        await renderComponent();

        const signInButton= screen.getByRole('link',{
            name: /sign in/i
        })
        expect(signInButton).toBeInTheDocument()
        expect(signInButton).toHaveAttribute('href','/signin')
        const signUpButton= screen.getByRole('link',{
            name: /sign up/i
        })
        expect(signUpButton).toBeInTheDocument()
        expect(signUpButton).toHaveAttribute('href','/signup')
    });
    test('should not visible sign out', async()=>{
        await renderComponent();

        const singOutButton = screen.queryByRole('link', {
            name: /sign out/i
        })
        expect(singOutButton).not.toBeInTheDocument()
    });
})    

