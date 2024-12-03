import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";
import { addSchool, getCurrrentSchool, updateSchool } from "@/api";

export default function SchoolPage() {
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Error",
            description: "No token found.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const data = await getCurrrentSchool(token);
        setSchool(data.school || null);
        if (data.school) {
          setSchoolName(data.school.name);
          setAddress(data.school.address);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch school data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [toast]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!logo && !isEditing) {
      newErrors.logo = "Logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME as string;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET as string;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
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

        const logoUrl = logo ? await handleImageUpload(logo) : school.logo;

        const formData = {
          name: schoolName,
          address,
          logo: logoUrl,
        };

        const response = isEditing
          ? await updateSchool(formData, school._id, token)
          : await addSchool(formData, token);

        if (!response.error) {
          toast({
            title: isEditing
              ? "School updated successfully"
              : "School added successfully",
            description: `${schoolName} has been ${
              isEditing ? "updated" : "added"
            } to the system.`,
          });
          setSchool(response.data.school);
          setIsEditing(false);
          navigate(`/addschool`);
        } else {
          toast({
            title: "Error",
            description: "Failed to process the request. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process the request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  if (school) {
    return (
      <div className="grid place-items-center">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 items-center space-x-4">
            <img
              src={school.logo || "/default-logo.png"}
              alt={school.name}
              className="w-72 h-72 object-cover rounded-full"
            />
            <div className="text-center">
              <h2 className="text-4xl font-bold">Schoolname: {school.name}</h2>
              <p className="text-xl">Address: {school.address}</p>
            </div>
            <div className="flex gap-4">
              <Button variant={"outline"} onClick={() => navigate("/addteacher")}>
                Add Teacher
              </Button>
              <Button variant={"outline"} onClick={() => navigate("/viewteacher")}>
                View Teacher
              </Button>
              <Button variant={"outline"} onClick={() => navigate("/addstudent")}>
                Add Students
              </Button>
              <Button variant={"outline"} onClick={() => navigate("/viewstudent")}>
                View Students
              </Button>
              <Button variant={"outline"} onClick={() => setIsEditing(true)}>
                Edit School
              </Button>
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="grid place-items-center w-full h-full mt-20">
            <div className="bg-white shadow-xl p-4 rounded-lg">
              <h1 className="text-3xl font-bold mb-6">
                {isEditing ? "Edit School" : "Add School"}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                  {errors.schoolName && (
                    <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <Label htmlFor="logo">Logo</Label>
                    <Input
                      id="logo"
                      type="file"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      accept="image/*"
                    />
                    {errors.logo && (
                      <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                    )}
                  </div>
                )}
                <Button type="submit">
                  {isEditing ? "Update School" : "Add School"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="grid place-items-center w-full h-full mt-20">
      <div className="bg-white shadow-xl p-4 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? "Edit School" : "Add School"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          {!isEditing && (
            <div>
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                type="file"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                accept="image/*"
              />
              {errors.logo && (
                <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
              )}
            </div>
          )}
          <Button type="submit">
            {isEditing ? "Update School" : "Add School"}
          </Button>
        </form>
      </div>
    </div>
  );
}
