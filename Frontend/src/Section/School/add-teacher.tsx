import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addTeacher } from "@/api";
import { Checkbox } from "@/components/ui/checkbox";
import Loading from "../Loading";

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    subject: "",
    email: "",
    checkbox: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, password, subject, email, checkbox } = formData;

    if (!name || !password || !subject || !email) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "You are not authenticated.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const teacherData = {
        name,
        password,
        subject,
        email,
        recieveMails: checkbox,
        token,
      };

      const response = await addTeacher(teacherData, token);

      if (!response.error) {
        toast({
          title: "Teacher added successfully",
          description: `${name} has been added.`,
        });
        navigate("/viewteacher");
      } else {
        toast({
          title: "Error",
          description: "Failed to add teacher. Please try again.",
          variant: "destructive",
        });
      }

      setFormData({
        name: "",
        password: "",
        subject: "",
        email: "",
        checkbox: false,
      });
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    alert("An unexpected error occurred. Please try again. " + error);
  }

  return (
    <div className="grid place-items-center w-full h-full mt-20">
      <div className="bg-white shadow-xl p-4 w-40 sm:w-40 md:w-60 lg:w-96 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Add Teacher</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="flex items-center mt-2">
              <Checkbox
                checked={formData.checkbox}
                onCheckedChange={(e)=>setFormData((prevState)=>({...prevState,checkbox:e as boolean}))}
              />
              <span className="text-sm ml-2 text-semibold">
                Do you want to receive Emails
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Add Teacher</Button>
        </form>
      </div>
    </div>
  );
}
