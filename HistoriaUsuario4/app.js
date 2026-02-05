// ========================================
// PRODUCT HUB PRO - JAVASCRIPT AVANZADO
// Sistema completo de gestión de productos
// ========================================

// ===== CONFIGURACIÓN GLOBAL =====
const API_URL = 'http://localhost:3000/productos';
let productos = [];
let productoEditando = null;
let filtroActual = 'todos';
let terminoBusqueda = '';

// ===== ELEMENTOS DEL DOM =====
const formularioProducto = document.getElementById('formularioProducto');
const nombreProducto = document.getElementById('nombreProducto');
const precioProducto = document.getElementById('precioProducto');
const categoriaProducto = document.getElementById('categoriaProducto');
const descripcionProducto = document.getElementById('descripcionProducto');
const listaProductos = document.getElementById('listaProductos');
const btnSincronizar = document.getElementById('btnSincronizar');
const btnCancelar = document.getElementById('btnCancelar');
const toastContainer = document.getElementById('toastContainer');
const searchInput = document.getElementById('searchInput');
const formTitle = document.getElementById('formTitle');
const submitText = document.getElementById('submitText');
const submitIcon = document.getElementById('submitIcon');

// Elementos de estadísticas
const totalProductos = document.getElementById('totalProductos');
const valorTotal = document.getElementById('valorTotal');
const precioPromedio = document.getElementById('precioPromedio');

// ========================================
// SISTEMA DE NOTIFICACIONES MEJORADO
// ========================================

/**
 * Muestra una notificación toast moderna
 * @param {string} titulo - Título de la notificación
 * @param {string} mensaje - Mensaje de la notificación
 * @param {string} tipo - Tipo: 'success', 'error', 'info'
 */
function mostrarToast(titulo, mensaje, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const iconos = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${iconos[tipo]}</div>
        <div class="toast-content">
            <div class="toast-title">${titulo}</div>
            <div class="toast-message">${mensaje}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    console.log(`[${tipo.toUpperCase()}] ${titulo}: ${mensaje}`);
}

// ========================================
// VALIDACIONES MEJORADAS
// ========================================

/**
 * Valida todos los campos del formulario
 * @returns {Object} - {valido: boolean, errores: string[]}
 */
function validarFormulario() {
    const errores = [];
    
    const nombre = nombreProducto.value.trim();
    const precio = precioProducto.value.trim();
    
    // Validar nombre
    if (!nombre) {
        errores.push('El nombre es obligatorio');
    } else if (nombre.length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    } else if (nombre.length > 100) {
        errores.push('El nombre no puede exceder 100 caracteres');
    }
    
    // Validar precio
    if (!precio) {
        errores.push('El precio es obligatorio');
    } else {
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum)) {
            errores.push('El precio debe ser un número válido');
        } else if (precioNum <= 0) {
            errores.push('El precio debe ser mayor a 0');
        } else if (precioNum > 1000000) {
            errores.push('El precio no puede exceder $1,000,000');
        }
    }
    
    if (errores.length > 0) {
        mostrarToast('Error de Validación', errores[0], 'error');
        return { valido: false, errores };
    }
    
    return { valido: true, errores: [] };
}

/**
 * Limpia el formulario y resetea el estado
 */
function limpiarFormulario() {
    formularioProducto.reset();
    productoEditando = null;
    formTitle.textContent = 'Nuevo Producto';
    submitText.textContent = 'Agregar';
    submitIcon.textContent = '✓';
}

// ========================================
// ESTADÍSTICAS Y CÁLCULOS
// ========================================

/**
 * Calcula y actualiza las estadísticas
 */
function actualizarEstadisticas() {
    const total = productos.length;
    const suma = productos.reduce((acc, p) => acc + parseFloat(p.precio), 0);
    const promedio = total > 0 ? suma / total : 0;
    
    // Actualizar DOM con animación
    totalProductos.textContent = total;
    valorTotal.textContent = `$${suma.toFixed(2)}`;
    precioPromedio.textContent = `$${promedio.toFixed(2)}`;
}

// ========================================
// MANIPULACIÓN DEL DOM
// ========================================

/**
 * Obtiene el emoji según la categoría
 * @param {string} categoria - Categoría del producto
 * @returns {string} - Emoji correspondiente
 */
function obtenerEmojiCategoria(categoria) {
    const emojis = {
        'Electrónica': '📱',
        'Ropa': '👕',
        'Hogar': '🏠',
        'Deportes': '⚽',
        'Libros': '📚',
        'Juguetes': '🎮',
        'Otro': '📦'
    };
    return emojis[categoria] || '📦';
}

/**
 * Renderiza la lista de productos con filtros aplicados
 */
function renderizarProductos() {
    listaProductos.innerHTML = '';
    
    // Filtrar productos
    let productosFiltrados = productos;
    
    // Aplicar filtro de categoría
    if (filtroActual !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => 
            p.categoria === filtroActual
        );
    }
    
    // Aplicar búsqueda
    if (terminoBusqueda) {
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
        );
    }
    
    // Mostrar estado vacío
    if (productosFiltrados.length === 0) {
        listaProductos.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-title">No hay productos</div>
                <div class="empty-description">
                    ${terminoBusqueda || filtroActual !== 'todos' 
                        ? 'No se encontraron productos con los filtros aplicados' 
                        : 'Agrega tu primer producto usando el formulario'}
                </div>
            </div>
        `;
        actualizarEstadisticas();
        return;
    }
    
    // Crear elementos para cada producto
    productosFiltrados.forEach(producto => {
        const li = crearElementoProducto(producto);
        listaProductos.appendChild(li);
    });
    
    actualizarEstadisticas();
}

/**
 * Crea un elemento HTML para un producto
 * @param {Object} producto - Datos del producto
 * @returns {HTMLElement} - Elemento li creado
 */
function crearElementoProducto(producto) {
    const li = document.createElement('li');
    li.className = 'product-item';
    li.dataset.id = producto.id;
    
    const emoji = obtenerEmojiCategoria(producto.categoria);
    const fechaCreacion = producto.fechaCreacion 
        ? new Date(producto.fechaCreacion).toLocaleDateString('es-ES')
        : 'N/A';
    
    li.innerHTML = `
        <div class="product-image">${emoji}</div>
        <div class="product-info">
            <div class="product-name">${producto.nombre}</div>
            <div class="product-price">$${parseFloat(producto.precio).toFixed(2)}</div>
            <div class="product-description">
                ${producto.descripcion || 'Sin descripción disponible'}
            </div>
            <div class="product-meta">
                ${producto.categoria ? `
                    <div class="meta-item">
                        <span>📁</span>
                        <span>${producto.categoria}</span>
                    </div>
                ` : ''}
                <div class="meta-item">
                    <span>📅</span>
                    <span>${fechaCreacion}</span>
                </div>
                <div class="meta-item">
                    <span>🔖</span>
                    <span>ID: ${producto.id}</span>
                </div>
            </div>
        </div>
        <div class="product-actions">
            <button class="btn-icon-only btn-edit" onclick="editarProducto('${producto.id}')">
                ✏️
            </button>
            <button class="btn-icon-only btn-delete" onclick="eliminarProducto('${producto.id}')">
                🗑️
            </button>
        </div>
    `;
    
    return li;
}

// ========================================
// LOCAL STORAGE
// ========================================

/**
 * Guarda los productos en Local Storage
 */
function guardarEnLocalStorage() {
    try {
        localStorage.setItem('productos', JSON.stringify(productos));
        console.log('✅ Datos guardados en Local Storage');
    } catch (error) {
        console.error('❌ Error al guardar en Local Storage:', error);
        mostrarToast('Error', 'No se pudieron guardar los datos localmente', 'error');
    }
}

/**
 * Carga los productos desde Local Storage
 */
function cargarDesdeLocalStorage() {
    try {
        const datos = localStorage.getItem('productos');
        if (datos) {
            productos = JSON.parse(datos);
            console.log(`✅ ${productos.length} productos cargados desde Local Storage`);
            renderizarProductos();
        }
    } catch (error) {
        console.error('❌ Error al cargar desde Local Storage:', error);
        productos = [];
    }
}

// ========================================
// OPERACIONES CRUD LOCALES
// ========================================

/**
 * Agrega un nuevo producto
 * @param {Object} nuevoProducto - Datos del producto
 */
function agregarProducto(nuevoProducto) {
    // Generar ID único
    nuevoProducto.id = Date.now().toString();
    nuevoProducto.fechaCreacion = new Date().toISOString();
    
    // Agregar al inicio del array
    productos.unshift(nuevoProducto);
    
    guardarEnLocalStorage();
    renderizarProductos();
    
    mostrarToast(
        '¡Producto Agregado!',
        `${nuevoProducto.nombre} se agregó exitosamente`,
        'success'
    );
    
    console.log('➕ Producto agregado:', nuevoProducto);
}

/**
 * Prepara el formulario para editar un producto
 * @param {string} id - ID del producto
 */
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        mostrarToast('Error', 'Producto no encontrado', 'error');
        return;
    }
    
    // Llenar formulario
    nombreProducto.value = producto.nombre;
    precioProducto.value = producto.precio;
    categoriaProducto.value = producto.categoria || '';
    descripcionProducto.value = producto.descripcion || '';
    
    // Actualizar UI
    productoEditando = id;
    formTitle.textContent = 'Editar Producto';
    submitText.textContent = 'Actualizar';
    submitIcon.textContent = '💾';
    
    // Scroll al formulario
    document.querySelector('.form-card').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    nombreProducto.focus();
    
    mostrarToast(
        'Modo Edición',
        `Editando: ${producto.nombre}`,
        'info'
    );
}

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {Object} datosActualizados - Nuevos datos
 */
function actualizarProducto(id, datosActualizados) {
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        mostrarToast('Error', 'Producto no encontrado', 'error');
        return;
    }
    
    // Mantener datos originales
    productos[index] = {
        ...productos[index],
        ...datosActualizados,
        id: id,
        fechaModificacion: new Date().toISOString()
    };
    
    guardarEnLocalStorage();
    renderizarProductos();
    
    mostrarToast(
        '¡Producto Actualizado!',
        `${datosActualizados.nombre} se actualizó correctamente`,
        'success'
    );
    
    console.log('💾 Producto actualizado:', productos[index]);
}

/**
 * Elimina un producto
 * @param {string} id - ID del producto
 */
function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        mostrarToast('Error', 'Producto no encontrado', 'error');
        return;
    }
    
    // Confirmar eliminación
    if (!confirm(`¿Estás seguro de eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    // Eliminar del array
    productos = productos.filter(p => p.id !== id);
    
    guardarEnLocalStorage();
    renderizarProductos();
    
    mostrarToast(
        'Producto Eliminado',
        `${producto.nombre} fue eliminado`,
        'info'
    );
    
    console.log('🗑️ Producto eliminado:', producto);
}

// ========================================
// FETCH API - OPERACIONES CRUD
// ========================================

/**
 * GET - Obtiene productos del servidor
 */
async function obtenerProductosAPI() {
    try {
        btnSincronizar.classList.add('loading');
        console.log('🔍 Consultando servidor...');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const productosAPI = await response.json();
        
        console.log(`✅ ${productosAPI.length} productos obtenidos del servidor`);
        
        productos = productosAPI;
        guardarEnLocalStorage();
        renderizarProductos();
        
        mostrarToast(
            'Sincronización Exitosa',
            `${productosAPI.length} productos sincronizados`,
            'success'
        );
        
        return productosAPI;
        
    } catch (error) {
        console.error('❌ Error de sincronización:', error);
        mostrarToast(
            'Error de Conexión',
            `No se pudo conectar al servidor. Usando datos locales.`,
            'error'
        );
        cargarDesdeLocalStorage();
    } finally {
        btnSincronizar.classList.remove('loading');
    }
}

/**
 * POST - Crea producto en el servidor
 * @param {Object} producto - Datos del producto
 */
async function crearProductoAPI(producto) {
    try {
        console.log('📤 Enviando producto al servidor...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const productoCreado = await response.json();
        console.log('✅ Producto creado en servidor:', productoCreado);
        
        return productoCreado;
        
    } catch (error) {
        console.error('❌ Error al crear en servidor:', error);
        mostrarToast(
            'Advertencia',
            'Producto guardado solo localmente',
            'info'
        );
    }
}

/**
 * PUT - Actualiza producto en el servidor
 * @param {string} id - ID del producto
 * @param {Object} producto - Nuevos datos
 */
async function actualizarProductoAPI(id, producto) {
    try {
        console.log('📤 Actualizando en servidor...');
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const productoActualizado = await response.json();
        console.log('✅ Producto actualizado en servidor');
        
        return productoActualizado;
        
    } catch (error) {
        console.error('❌ Error al actualizar en servidor:', error);
    }
}

/**
 * DELETE - Elimina producto del servidor
 * @param {string} id - ID del producto
 */
async function eliminarProductoAPI(id) {
    try {
        console.log('📤 Eliminando del servidor...');
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        console.log('✅ Producto eliminado del servidor');
        return true;
        
    } catch (error) {
        console.error('❌ Error al eliminar del servidor:', error);
    }
}

// ========================================
// BÚSQUEDA Y FILTROS
// ========================================

/**
 * Maneja la búsqueda de productos
 */
function manejarBusqueda() {
    terminoBusqueda = searchInput.value.trim();
    renderizarProductos();
}

/**
 * Maneja el cambio de filtro de categoría
 * @param {string} filtro - Categoría a filtrar
 */
function cambiarFiltro(filtro) {
    filtroActual = filtro;
    
    // Actualizar UI de botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filtro) {
            btn.classList.add('active');
        }
    });
    
    renderizarProductos();
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Maneja el envío del formulario
 */
formularioProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar
    const validacion = validarFormulario();
    if (!validacion.valido) {
        return;
    }
    
    // Recopilar datos
    const datosProducto = {
        nombre: nombreProducto.value.trim(),
        precio: parseFloat(precioProducto.value),
        categoria: categoriaProducto.value,
        descripcion: descripcionProducto.value.trim()
    };
    
    // Agregar o actualizar
    if (productoEditando) {
        actualizarProducto(productoEditando, datosProducto);
        await actualizarProductoAPI(productoEditando, datosProducto);
    } else {
        agregarProducto(datosProducto);
        await crearProductoAPI(datosProducto);
    }
    
    limpiarFormulario();
});

/**
 * Botón cancelar
 */
btnCancelar.addEventListener('click', () => {
    limpiarFormulario();
    mostrarToast('Cancelado', 'Operación cancelada', 'info');
});

/**
 * Botón sincronizar
 */
btnSincronizar.addEventListener('click', obtenerProductosAPI);

/**
 * Búsqueda en tiempo real
 */
searchInput.addEventListener('input', manejarBusqueda);

/**
 * Filtros de categoría
 */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        cambiarFiltro(btn.dataset.filter);
    });
});

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa la aplicación
 */
function inicializarApp() {
    console.log('🚀 Iniciando ProductHub Pro...');
    console.log('📅', new Date().toLocaleString('es-ES'));
    console.log('🌐 API URL:', API_URL);
    
    // Cargar datos locales
    cargarDesdeLocalStorage();
    
    // Intentar sincronizar con servidor
    obtenerProductosAPI();
    
    mostrarToast(
        '¡Bienvenido!',
        'ProductHub Pro está listo',
        'success'
    );
    
    console.log('✅ Aplicación iniciada correctamente');
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', inicializarApp);

// Exportar funciones globales
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;

// ========================================
// INFORMACIÓN DE DEBUGGING
// ========================================

console.log(`
╔═══════════════════════════════════════════════╗
║        PRODUCT HUB PRO - v2.0                 ║
║   Sistema Avanzado de Gestión de Productos    ║
╚═══════════════════════════════════════════════╝

📋 FUNCIONALIDADES:
  ✅ CRUD Completo (Create, Read, Update, Delete)
  ✅ Persistencia en Local Storage
  ✅ Sincronización con API REST
  ✅ Búsqueda en tiempo real
  ✅ Filtros por categoría
  ✅ Estadísticas dinámicas
  ✅ Validaciones avanzadas
  ✅ Sistema de notificaciones moderno
  ✅ Diseño responsive y profesional
  ✅ Animaciones y transiciones

🛠️ CONFIGURACIÓN DEL SERVIDOR:
  1. npm install -g json-server
  2. json-server --watch db.json --port 3000
  3. Servidor en: http://localhost:3000

📊 COMANDOS EN CONSOLA:
  productos          → Ver array de productos
  localStorage       → Ver almacenamiento local
  
💡 TIPS:
  - Los datos persisten automáticamente
  - Funciona offline con Local Storage
  - Sincroniza al conectar con el servidor
`);
