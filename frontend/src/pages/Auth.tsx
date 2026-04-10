import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import login from "@/api/loginApi";
import { useLoginMutation, useSignupMutation } from "@/store/api/authApi";
import { useGetDepartmentsQuery, useGetDesignationsQuery } from "@/store/api/masterApi";



const designations = [
  { id: 1, name: "Junior" },
  { id: 2, name: "Mid-Level" },
  { id: 3, name: "Senior" },
  { id: 4, name: "Lead" },
  { id: 5, name: "Manager" },
];

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    departmentId: "",
    designationId: "",
    joiningDate: "",
    employmentType: "full-time",
    salary: "",
  });


  const { data: departmentsData, isLoading: isDepartmentsLoading, error: departmentsError } = useGetDepartmentsQuery();
  const { data: designationsData, isLoading: isDesignationsLoading, error: designationsError } = useGetDesignationsQuery();

  const [signupMutation, { isLoading: isSignupLoading, error: signupError }] = useSignupMutation();

  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation({ email: loginData.email, password: loginData.password })
    navigate("/")
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(signupData)
    if (signupData.password !== signupData.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    signupMutation({
      name: signupData.firstName,
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
      department_id: signupData.departmentId,
      designation_id: signupData.designationId,
      joining_date: signupData.joiningDate,
      employment_type: signupData.employmentType,
      salary: signupData.salary,
    });
    toast({ title: "Signup functionality", description: "Backend not connected yet. Enable Lovable Cloud to add real authentication." });
    navigate("/");
  };




  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-sidebar-foreground font-['Plus_Jakarta_Sans']">
            HR Portal
          </h1>
        </div>

        <Card className="border-sidebar-border bg-card shadow-xl">
          <Tabs defaultValue="login">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <CardTitle className="text-xl">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access the portal</CardDescription>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@company.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Forgot your password?{" "}
                    <button type="button" className="text-primary hover:underline">Reset it</button>
                  </p>
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>Fill in your details to get started</CardDescription>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="signup-first">First Name</Label>
                      <Input
                        id="signup-first"
                        placeholder="Nandini"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-last">Last Name</Label>
                      <Input
                        id="signup-last"
                        placeholder="Bure"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@company.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={signupData.role} onValueChange={(v) => setSignupData({ ...signupData, role: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={signupData.departmentId} onValueChange={(v) => setSignupData({ ...signupData, departmentId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dept" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentsData?.data.map((d: any) => (
                            <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Select value={signupData.designationId} onValueChange={(v) => setSignupData({ ...signupData, designationId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {designationsData?.data?.map((d: any) => (
                            <SelectItem key={d.id} value={String(d.id)}>{d.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="signup-joining">Joining Date</Label>
                      <Input
                        id="signup-joining"
                        type="date"
                        value={signupData.joiningDate}
                        onChange={(e) => setSignupData({ ...signupData, joiningDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select value={signupData.employmentType} onValueChange={(v) => setSignupData({ ...signupData, employmentType: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-salary">Salary</Label>
                    <Input
                      id="signup-salary"
                      type="number"
                      placeholder="50000"
                      value={signupData.salary}
                      onChange={(e) => setSignupData({ ...signupData, salary: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">Create Account</Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-sidebar-foreground/50 mt-6">
          © 2026 HR Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
