import { Request, Response } from 'express';
import { registerUser, loginUser, resetPassword,userService } from '../services/user.service';
import { UserResponse } from '@supabase/supabase-js';
import { User } from '@base-project/shared';
import { supabase } from '../services/supabaseClient';

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing username, email or password' });
  }

  const user = await registerUser(username, email, password);
  if (!user) {
    return res.status(409).json({ success: false, error: 'User already exists' });
  }

  res.json({ success: true, message: 'User registered successfully' });
}





// export async function login(req: Request, res: Response) {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, error: 'Missing email or password' });
//   }

//   const token = await loginUser(email, password);
//   if (!token) {
//     return res.status(401).json({ success: false, error: 'Invalid credentials' });
//   }

//   res.json({ success: true, token });
// }



export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing email or password' });
  }

  const result = await loginUser(email, password);

  if (!result || result.error || !result.user) {
    // החזרת הודעה מתאימה ללקוח
    return res.status(401).json({
      success: false,
      error: result?.error,
      attemptsLeft: result?.attemptsLeft,
      blockedFor: result?.blockedFor
    });
  }

  res.json({
    success: true,
    token: result.token,
    user: {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email
    }
  });
}






export async function resetPasswordController(req: Request, res: Response) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, error: 'Missing email or new password' });
  }

  try {
    const result = await resetPassword(email, newPassword);

    if (!result) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Password reset successful',
      token: result.token
    });

  } catch (error) {
    console.error('❌ Error in reset-password:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

//get all users
export async function listUsers(req: Request, res: Response){
    try {
      const users: User[] = await userService.getAllUsers()

      const responseBody = {
        success: true,
        data: {
          items: users,
          total: users.length,
        },
      }

      res.json(responseBody)
    } catch (err: unknown) {
      // catch error
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred'

      res.status(500).json( {
        success: false,
        error: message,
      })
    }
  }


  export async function getUserRoleController(req: Request, res: Response) {
  const { email } = req.params;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Role not found' });
  }

  return res.json({ role: data.role });
}