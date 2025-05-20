import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from "./style.module.css";
import { ROUTES } from '@/routes/routes';
import logo1 from "../../../assets/temp1.jpg";
import logo2 from "../../../assets/temp2.jpg";
import logo3 from "../../../assets/temp3.jpg";
import logo4 from "../../../assets/temp4.jpg";

const templates = [
  { id: 1, name: 'Mẫu CV 1', image: logo1 },
  { id: 2, name: 'Mẫu CV 2', image: logo2 },
  { id: 3, name: 'Mẫu CV 3', image: logo3 },
  { id: 4, name: 'Mẫu CV 4', image: logo4 }
];


function CreateNameCV() {
  const [form, setForm] = useState({ name: "", templateId: "" });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    const savedDraft = localStorage.getItem('cv_draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.templateId) {
          const templateId = typeof parsedDraft.templateId === 'string' 
            ? parseInt(parsedDraft.templateId, 10) 
            : parsedDraft.templateId;
          
          setForm(prev => ({ 
            ...prev, 
            templateId: templateId,
            name: parsedDraft.name || prev.name
          }));
          
          if (!parsedDraft.name) {
            localStorage.removeItem('cv_draft');
          }
        }
      } catch (error) {
        console.error("Error parsing saved draft:", error);
      }
    }
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (form.name.length < 1) newErrors.name = "Vui lòng điền tên CV";
    if (!form.templateId) newErrors.templateId = "Vui lòng chọn một mẫu CV";  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors(""); 
    localStorage.setItem('cv_draft', JSON.stringify(form));
    navigate(ROUTES.CREATECVPAGE);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-20">
      <div className="flex flex-col gap-5">
        <Link className="text-gray-700 font-semibold text-[18px]" to={ROUTES.CVMANAGEMENT}>← Quay lại</Link>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-5 w-full justify-between">
            <div className={styles.inputWrapper}>
              <input type="text" name="name" placeholder="Nhập tên CV.." className={styles.input} value={form.name} onChange={handleChange} />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
              
            </div>
            <button type="submit" className={styles.button}>Tiếp tục</button>
          </div>
          <div className="mt-[30px]">
            <div className = "flex justify-between">
              <p className="text-gray-700 font-semibold text-[18px] mb-6">Chọn mẫu CV</p>
              {errors.templateId && <span className={styles.error}>{errors.templateId}</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setForm((prev) => ({ ...prev, templateId: tpl.id }))}
                  className={`cursor-pointer border rounded-lg p-3 text-center transition hover:border-[#D83B01] relative group shadow-lg ${
                    form.templateId === tpl.id ? "border-[#D83B01] ring-2 ring-[#D83B01]" : "border-gray-300"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-[320px] object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(tpl.image);
                      }}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Xem trước
                    </button>

                  </div>
                  <p className="text-sm font-medium mt-2">{tpl.name}</p>
                </div>
              ))}
            </div>
          </div>
        </form>
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
            onClick={() => setPreviewImage(null)} 
          >
            <div
              className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-4 text-black text-xl font-bold hover:text-red-600"
              >
                ✕
              </button>
              <img
                src={previewImage}
                alt="Xem trước template"
                className="h-[800px] max-h-[100vh] w-auto object-contain mx-auto rounded"
              />

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CreateNameCV;
