package com.example.Multi_Platform.requests;

public class LoginRequests {

    private String email;
    private String password;

    public LoginRequests() {
    }

    public LoginRequests(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Optional: if you want to keep getUserId for legacy reasons
    public String getUserId() {
        return email;
    }
}
