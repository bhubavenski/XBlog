import { test, expect } from '@playwright/test';

/*
1. should show error for invalid email
2. should show error for invalid password
3. should show error for invalid credentials 
4. should sign in successfully with valid credentials
*/

test('should how error for invalid email', async ({page}) => {
    page.goto('/');
    
})