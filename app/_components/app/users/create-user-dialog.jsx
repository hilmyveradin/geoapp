import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const CreateUserDialog = ({ children }) => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [submittingData, setSubmittingData] = useState(false);
  const [roles, setRoles] = useState([]);

  const [userData, setUserData] = useState({
    login_name: "",
    full_name: "",
    email: "",
    password: "",
    role_uid: [],
  });

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/roles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      const responseJson = await response.json();
      const rolesData = responseJson.data;
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    if (!openDialog) {
      setUserData({
        login_name: "",
        full_name: "",
        email: "",
        password: "",
        role_uid: [],
      });
    } else {
      fetchRoles();
    }
  }, [openDialog, fetchRoles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRoleChange = (selectedRoles) => {
    setUserData({ ...userData, role_uid: selectedRoles });
  };

  const createUser = async () => {
    setSubmittingData(true);
    try {
      const response = await fetch("/api/admin/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to create user");

      toast({ title: "User created successfully", variant: "success" });
      setOpenDialog(false);
      setUserData({
        login_name: "",
        full_name: "",
        email: "",
        password: "",
        role_uid: [],
      });
    } catch (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingData(false);
    }
  };

  console.log(roles);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Create New User</DialogHeader>
        <div className="space-y-4">
          <Input
            name="login_name"
            placeholder="Login Name"
            value={userData.login_name}
            onChange={handleInputChange}
          />
          <Input
            name="full_name"
            placeholder="Full Name"
            value={userData.full_name}
            onChange={handleInputChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Roles" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.roleUid} value={role.roleUid}>
                  {role.roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpenDialog(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={createUser} disabled={submittingData}>
            {submittingData ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
