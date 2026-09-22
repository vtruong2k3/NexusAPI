export default {
  audit: {
    title: 'Audit Logs',
    description: 'Ghi lại các thao tác quản lý bởi admin và người dùng. Thông tin xác thực header chỉ giữ ký tự đầu/cuối và nội dung request body bị che. Không thể xóa từng mục; xóa tất cả yêu cầu xác minh hai bước.',
    clearAll: 'Xóa tất cả',
    empty: 'Chưa có audit log nào',
    loadFailed: 'Tải audit log thất bại',
    filters: {
      all: 'Tất cả',
      q: 'Từ khóa',
      qPlaceholder: 'Đường dẫn / hành động / email người thực hiện',
      actorEmail: 'Email người thực hiện',
      action: 'Hành động',
      clientIp: 'IP Client',
      method: 'Phương thức',
      authMethod: 'Phương thức xác thực',
      result: 'Kết quả',
      resultSuccess: 'Thành công',
      resultFailure: 'Thất bại',
      startTime: 'Thời gian bắt đầu',
      endTime: 'Thời gian kết thúc'
    },
    columns: {
      time: 'Thời gian',
      actor: 'Người thực hiện',
      action: 'Hành động',
      method: 'Phương thức',
      result: 'Kết quả',
      clientIp: 'IP Client',
      detail: 'Chi tiết'
    },
    detail: {
      title: 'Chi tiết Audit Log',
      actorRole: 'Vai trò',
      methodPath: 'Phương thức / Đường dẫn',
      latency: 'Độ trễ',
      requestId: 'Request ID',
      credential: 'Thông tin xác thực (đã che)',
      userAgent: 'User-Agent',
      requestBody: 'Request Body (đã che)',
      extra: 'Thêm'
    },
    clearConfirm: {
      title: 'Xóa tất cả Audit Log',
      message: 'Thao tác này xóa vĩnh viễn tất cả audit log và không thể hoàn tác. Hành động xóa sẽ được ghi lại. Tiếp tục?',
      totpTitle: 'Nhập mã xác minh hai bước',
      totpHint: 'Xóa audit log yêu cầu xác minh TOTP mới.',
      success: 'Đã xóa {count} audit log',
      failed: 'Xóa audit log thất bại'
    }
  }
}
