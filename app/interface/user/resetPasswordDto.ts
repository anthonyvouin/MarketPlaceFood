export interface UserWithResetToken {
    id: string;
    email: string;  
    resetToken: string;  
    resetTokenExpires: Date;  
    password: string;  
  }
  
  